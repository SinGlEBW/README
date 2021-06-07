let text = document.querySelector('.text');
text.innerHTML = text.textContent.replace(/\S/g, "<span>$&</span>"); //каждая буква из textContent будет вставляться вместо $&