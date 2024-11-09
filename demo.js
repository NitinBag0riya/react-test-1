var h1 = document.createElement("h1")
h1.addEventListener('click', function(){ alert('Hello From H1')});
h1.innerHTML = "Hello H1 Heading"
'Hello H1 Heading'
var getRoot = document.querySelectorAll('body');
getRoot[0].append(h1)
