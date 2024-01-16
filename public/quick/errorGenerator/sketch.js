let dict = {
  "name":"message",
  "message":"does it work?",
  "error":"it",
  "errorType":"RunTime Error",
  "errorItem":"item",
  "errorMessage":"is unintelligible"
}

function f(str) {
  const match = str.match(/[A-Z]/);
  if (match) {
    const index = match.index;
    return str.substring(index);
  }
  return '';
}

// dict.errorItem = (f(dict.errorType).length<dict.errorType)?(f(dict.errorType)):(f(dict.errorType.substring(1)));

let err = ""
err += "PS Home:> & \"Home:\\program files\\"+dict.name+".exe\" \"Home:\\messages\\latest.js\"\nTraceback (most recent call last):\n  File \"Home:\\messages\\latest.txt\", line 1\n    "+dict.message+"\n  "+dict.errorType+": "+dict.errorItem+" \""+dict.error+"\" "+dict.errorMessage+"\nHome:>"
console.log(err)