function getTimeStringSinceStart( startTime )
{
    let difference = Date.now() - startTime;

    let hours = Math.floor(difference/1000/60/60);
    difference -= hours * 1000 * 60 * 60;

    let minutes = Math.floor(difference/1000/60);
    difference -= minutes * 1000 * 60;

    let seconds = Math.floor(difference/1000);
    difference -= seconds * 1000;

    let milli = Math.floor(difference);

    return  `${hours.toString().padStart(2, "0")}` +
            `:${minutes.toString().padStart(2, "0")}` +
            `:${seconds.toString().padStart(2, "0")}` +
            `,${milli.toString().padStart(3, "0")}`;
}


function extractContentFromXML( XMLmessage )
{
    const XMLstring = XMLmessage.toString();
    let step1 = XMLstring.split('\"Current Slide\"');

    // If XML message didn't find a place to split on "Current Slide"
    if (step1.length == 1)
        return null;

    // Extract current content of slide
    let step2 = step1[1].split('>')[1];
    let currentSlide = step2.split('<')[0];
   
    // Return with only "single white space" and uppercase
    return currentSlide.replace(/\s+/g, ' ').toUpperCase();
}


module.exports = { getTimeStringSinceStart, extractContentFromXML };