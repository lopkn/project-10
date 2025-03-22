


let mainarr = 
`# are you ready to argue?
# are you sure?
# ok you are SURE you are sure
# like you are very certain?

# ok




# there exists two categories of statements, Objective and Subjective

# whether or not someone is a MURDERER does not change the validity of their content of speech

# whether or not a statement is Objective DOES change the validity of the statement

`.split("# ")
mainarr.splice(0,1)


let mainDiv = document.getElementById("maindiv")

mainarr.forEach((e)=>{
	let lbl = document.createElement("label")
	lbl.classList.add("notActive")
	let checkbox = document.createElement("input")
	checkbox.type = "checkbox"


	checkbox.classList.add("t")

	lbl.appendChild(checkbox)
	lbl.appendChild(document.createTextNode(e))

	mainDiv.append(lbl)
})