#include <math.h> // fmod()
#include <stdio.h>
#include <string.h> 
#include <sys/time.h> // timeval, gettimeofday()

// Parses time code
void parseTimeCode( struct timeval *init , char *time_code_container )
{
    // Measure time diff
    struct timeval diff;
    gettimeofday(&diff, 0);
    long seconds = diff.tv_sec - init -> tv_sec;
    long microseconds = diff.tv_usec - init -> tv_usec;
    double elapsed = seconds + microseconds * 1e-6;

    // Calculate time values
    int srt_hours = (int) elapsed / 3600;
    int srt_minutes = (elapsed - (3600 * srt_hours)) / 60;
    double elapsed_seconds = fmod(elapsed , 60);
    double srt_seconds, srt_milliseconds;
    srt_milliseconds = modf(elapsed_seconds, &srt_seconds) * 1000;

    // Format
    sprintf(time_code_container, "%02d:%02d:%02d,%03d",
        srt_hours,
        srt_minutes,
        (int) srt_seconds,
        (int) srt_milliseconds
    );
}
    


// Inits file with timestamp as filename
void initFileWithTimeStamp( FILE **file_pointer )
{
    // Init file for SRT output
    time_t rawtime = time(NULL);
    struct tm *ptm = localtime(&rawtime);
    char file_name[ 50 ] = { 0 };
    sprintf(file_name, "./%02d-%02d-%02d - %02d.%02d.%02d.srt",
        ptm -> tm_year - 100,
        (ptm -> tm_mon) + 1,
        ptm -> tm_mday,
        ptm -> tm_hour,
        ptm -> tm_min,
        ptm -> tm_sec
    );
    *file_pointer = fopen(file_name, "w");
}



// Replaces '\n' with ' ' in char*
void removeNewLines( char *content )
{
    char *p = content;
    // Replace all ”\n" with " "
    while ( *p != '\0' )
    {
        if ( *p == '\n' )
            *p = ' ';
        p++;
    }

    // Reset pointer and only keep single spaces
    p = content;
    int i = 0;
    while ( *p != '\0' )
    {
        content[i++] = *(p++);
        // If previous was space, skip this and upcoming spaces
        if ( *(p-1) == ' ' )
            while ( *p == ' ' ) p++;
    }
    content[i] = '\0';
}



// - Extracts content of "Current Slide" from PP6 XML message
// - Also handles some extra formatting
void extractCurrentSlideContent( char *content , char *buffer )
{
    char *t1 = strstr(buffer, "Current Slide");
    char *t2 = strtok(t1, ">");
    t2 = strtok(NULL, ">");
    char *t3 = strtok(t2, "<");
    // TODO: Make "toUpper" for UTF-8
    removeNewLines(t3);
    strcpy(content, t3);
}