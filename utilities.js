function addAnnots(annots) {
	for (var k in annots[1]) {
		var input = document.createElement('input');
		input.type = 'radio';
        input.value = k;
        input.checked = 'checked';
        input.label=k;
        input.id = k;
		
		var newlabel = document.createElement("label");
		newlabel.setAttribute("for",k);
		newlabel.innerHTML = k;
		
		document.getElementById('annot_form')
			.appendChild(input);
		document.getElementById('annot_form')
			.appendChild(newlabel);
	}
	
}
