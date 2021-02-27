// Helper functions
#include "functions.c"

#include <arpa/inet.h>
#include <math.h> // fmod()
#include <signal.h> // catching ctrl + c
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h> // atoi()
#include <string.h> 
#include <sys/socket.h>
#include <sys/time.h> // timeval, gettimeofday()
#include <unistd.h> 


#define BUFFER_SIZE 2048
#define CONTENT_SIZE 500
FILE *file;


// Upon killed process, cleans up before exiting
void sigintCleanup( int sig_num )
{ 
    fclose(file);
    printf("\n");
    exit(sig_num);
}


int main( int argc , char const *argv[] ) 
{ 
    if ( argc != 2 )
    {
        printf("\nUSAGE: main [PORT]\n");
        return -1;
    }


    // Create socket
    const int PORT = atoi(argv[ 1 ]);
    int sock = 0;
    struct sockaddr_in serv_addr; 
    if ( (sock = socket(AF_INET, SOCK_STREAM, 0)) < 0 ) 
    { 
        printf("\nSocket creation error\n");
        return -1; 
    } 
   

    // Setup connnection (localhost: "127.0.0.1")
    serv_addr.sin_family = AF_INET; 
    serv_addr.sin_port = htons(PORT);
    serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1");

    if ( connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0 ) 
    { 
        printf("\nConnection failed\n");
        return -1; 
    }


    // Setup login to ProPresenter
    char* login_message = "<StageDisplayLogin>avteam</StageDisplayLogin>\r\n"; 
    send(sock, login_message, strlen(login_message), 0); 
    printf("Login message sent\n");


    // Prepare recieving of messages from authorized socket
    char buffer[ BUFFER_SIZE ] = { 0 };
    read(sock, buffer, BUFFER_SIZE); // Skip "Login Success Message"
    read(sock, buffer, BUFFER_SIZE); // Skip: "Display Layout Message"


    // Init SRT-file
    initFileWithTimeStamp(&file);
    // On aborted program (Ctrl+C) then clean up before exiting
    signal(SIGINT, sigintCleanup);


    // Start measuring time for timestamping
    struct timeval init;
    gettimeofday(&init, 0);


    // Values necessary for continous handling of input
    char content_prev[ CONTENT_SIZE ] = { 0 };
    char content_curr[ CONTENT_SIZE ] = { 0 };
    char time_prev[ 13 ] = { 0 };
    char time_curr[ 13 ] = { 0 };
    char output_buffer[ CONTENT_SIZE ] = { 0 };
    int identifier = 1;

    // Set up values for "previous variables" (first value)
    while ( read(sock, buffer, BUFFER_SIZE) != 0 )
    {
        extractCurrentSlideContent(content_prev, buffer);

        // "Empty slide"
        if ( strcmp(content_prev, "/Field") == 0 )
            continue;

        // Prepare time string for SRT format
        parseTimeCode(&init, time_prev);

        // First content is set up, begin continous listening!
        break;
    }

    // Continous listening from socket
    while ( read(sock, buffer, BUFFER_SIZE) != 0 )
    {
        extractCurrentSlideContent(content_curr, buffer);

        // Prepare time string for SRT format
        parseTimeCode(&init, time_curr);

        // Message with zero time length, omit
        if ( strcmp(time_prev, time_curr) == 0 )
            continue;
        // Message holds same information as previous message
        else if ( strcmp(content_curr, content_prev) == 0 )
            continue;

        // Prepare SRT string
        sprintf(output_buffer, "%d\n%s --> %s\n%s\n\n",
            identifier,
            time_prev,
            time_curr,
            content_prev
        );

        bool emptySlide = ( strcmp(content_prev, "/Field") == 0 );

        // Keep timecodes and previous "content" messages in sync
        strcpy(time_prev, time_curr);
        strcpy(content_prev, content_curr);

        // "Empty slide" - Skip printing
        if ( emptySlide )
            continue;

        // Output message to terminal
        printf("%s", output_buffer);

        // Print to file & increment identifier
        fprintf(file, "%s", output_buffer);
        identifier++;
    }

    return 0;
}