var script = document.createElement('script');
script.src = "http://localhost:3000/libraries/jquery.js"



document.head.appendChild(script);
/// appending the jquery

script.onload = other


var highlighter, findElementByText;


function other(){


findElementByText = (text)=>{
    var jSpot = $("span:contains(" + text + ")")
                .filter(function() { return $(this).children().length === 0;})
                .parent();  // because you asked the parent of that element

    return jSpot;
}


highlighter=(wordToHighlight,color="rgba(125,0,255,0.5)",items=$('*:visible:not(a)'))=>{
	const regex = new RegExp(`(${wordToHighlight})`, 'gi');
	    // items.html(function(_, html) {
	    //     return html.replace(regex, '<span style="background-color:'+color+'">$1</span>');
	    // });

	    items.each(function() {
        $(this).contents().each(function() {
            // Check if the current node is a text node
            if (this.nodeType === Node.TEXT_NODE) {
                const html = this.nodeValue;
                const highlightedHtml = html.replace(regex, '<span style="background-color:' + color + '">$1</span>');
                $(this).replaceWith(highlightedHtml);
            }
        });
    });
}



// (function($) {
//     $.fn.highlighter = (word,col)=>{
//     // `this` refers to the jQuery object
//     return this.each(function() {
//         // Your custom behavior here
//         // console.log($(this).text());
//         highlighter(word,col,this)
//     });
//     };
// }(jQuery))

}
