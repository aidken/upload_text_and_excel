# Upload Text and Excel File

A sample HTML and JavaScript that accepts a text file upload and a Excel file upload in one form.
I am making this application to learn JavaScript myself.

# Development

### July 24th 2020

Created an HTML form that accepts uploads of a text file and an Excel file. Upon change event,
they parse uploaded file, do something about uploaded contents, and show feedback on the web page.

Reference I read today:
- [HTML label tag](https://www.w3schools.com/tags/tag_label.asp)
- [How to parse Excel file in Javascript/HTML5](https://stackoverflow.com/a/52870648/1797738)
- [Get Programming with JavaScript](https://www.manning.com/books/get-programming-with-javascript)
- [JavaScripture FileReader](https://www.javascripture.com/FileReader)
- [JavaScripture Array](https://www.javascripture.com/Array#forEach)

Can I let browser understand edits I make at VS Code? -> Yes.

Now I want to write code that runs upon two uploads are done. How can I fire this event?
Read [Creating and triggering events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events).
Let's fire successful events when parsing of files is done, and run code that use parsed data from files.


### July 26th 2020.

Wrote code that bring info to variables at the global scope.

Reference I read today:
- [Object.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
- [Object keys, values, entries](https://javascript.info/keys-values-entries)

  You cannot write variable.keys(). You have to write Object.keys(variable). Interesting... It took good 30 minutes before understanding I have to write 'Object' literally.

- [Iterating through object keys and values in JavaScript](https://attacomsian.com/blog/javascript-iterate-objects)

  In order to iterate through object, you have to obtain keys first. JavaScript does not let you this in one step.

- [typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)

  You can write either of

    typeof variable
    
    typeof(variable)
