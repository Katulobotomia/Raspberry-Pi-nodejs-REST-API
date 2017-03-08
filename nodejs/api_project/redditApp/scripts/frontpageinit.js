var threadghostsArray = [];
var threadsArray = [];
var iterationTime = 85;


// Updates thread positions (DON'T USE THIS FUNCTION!!!!!!!)
function rearrangeThreads(element, index)
{
    var threadlen = threadsArray.length;
    var itertime = iterationTime;

    if(index == threadlen - 1){itertime = 0;}

    setTimeout(function ()
    {
        // Offset the thread coordinates based on where they are relative to the page
        var offsetcoords = getCoords(threadghostsArray[index]);
        element.style.top = 0;
        
        var elem = element; // Element to animate
        var rect = document.getElementById("threadghost " + index).getBoundingClientRect(); // Current position of said element
        var bodyRect = document.body.getBoundingClientRect();
        var threadfield = document.getElementById("threadfield").getBoundingClientRect();
        var coordx = rect.left - bodyRect.left - threadfield.left;
        var coordy = offsetcoords.top;

        var trans = Morf.transition(elem, {
                // New CSS state
                                            '-webkit-transform': 'translate3d(' + coordx + 'px, ' + coordy + 'px, 0)',
                                        }, {
                                            duration: '500ms',
                                            timingFunction: 'ease',
                                            increment: 0.4,
                                            callback: function (elem) {
                                                // You can optionally add a callback option for when the animation completes.
                                            }
                                        });
    }, itertime * (Math.random() * 3) + 1);

    itertime = iterationTime;
}

function makeNewThread(data)
{
    var text = data.text;
    var title = data.title;

    var newthread = document.createElement("div");
    var newthreadname = document.createElement("div");
    var newthreadmessage = document.createElement("div");

    var threadfield = document.getElementById("threadfield");

    newthread.className = "thread";
    newthreadname.className = "threadname";
    newthreadmessage.className = "threadmessage";

    newthread.id = "thread " + threadsArray.length;
    
    newthread.appendChild(newthreadname);
    newthread.appendChild(newthreadmessage);
    newthreadname.appendChild(document.createTextNode(title));
    newthreadmessage.appendChild(document.createTextNode(text));

    threadsArray.push(newthread);

    threadfield.insertBefore(newthread, threadfield.firstChild);
    // ###################################################################

    var newthreadghost = document.createElement("div");
    var newthreadnameghost = document.createElement("div");
    var newthreadmessageghost = document.createElement("div");

    newthreadghost.className = "threadghost";
    newthreadnameghost.className = "threadnameghost";
    newthreadmessageghost.className = "threadmessageghost";

    newthreadghost.id = "threadghost " + threadghostsArray.length;

    newthreadghost.appendChild(newthreadmessageghost);
    newthreadghost.appendChild(newthreadnameghost);
    newthreadmessageghost.appendChild(document.createTextNode(text));
    newthreadnameghost.appendChild(document.createTextNode(title));

    threadghostsArray.push(newthreadghost);

    threadfield.insertBefore(newthreadghost, threadfield.firstChild);

    rearrangeThreadsInit();

    $(newthread).fadeIn();
}

// Get element coordinates in relation to the page
function getCoords(elem) 
{ 
    // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

function getUserSubscriptions()
{
    var response = $.ajax(
                {
                    type: "GET",
                    dataType: "json",
                    url: "https://oauth.reddit.com/subreddits/mine/subscriber",
                    headers: 
                    {
                        'Authorization': 'bearer ' + getCookie("access_token")                    
                    },
                    success: function(data)
                    {
                        console.log("Everything went fine and now rendering subscribed threads!");
                        // Rendering the user info now
                        
                    }
                });
    console.log(response);    
}

function getUserInfo()
{
    var response = $.ajax(
                {
                    type: "GET",
                    dataType: "json",
                    url: "https://oauth.reddit.com/api/v1/me",
                    headers: 
                    {
                        'Authorization': 'bearer ' + getCookie("access_token")                    
                    },
                    success: function(data)
                    {
                        console.log("Everything went fine and now rendering user info!");
                        // Rendering the user info now
                        document.getElementById("name").innerHTML = json.name;  // Render nickname
                        document.getElementById("linkkarma").innerHTML = "Link karma: " + response.responseJSON.link_karma;  // Render link karmas
                        document.getElementById("commentkarma").innerHTML = "Comment karma: " + response.responseJSON.comment_karma; // Render comment karmas
                    }
                });
    //console.log(response);    
}

// The loopty loop for the thread arranger (USE THIS TO REARRANGE THE THREADS!!!!!!!)
function rearrangeThreadsInit()
{
    // Slightly faster loopty loop than anything else
    var i = 0;
    var e = threadsArray.length;
    while(e--)
    {
        rearrangeThreads(threadsArray[i], i);
        i++;
    }
}

// Start the page here
function initPage()
{
    getUserInfo();
    getUserSubscriptions();
    rearrangeThreadsInit();
}