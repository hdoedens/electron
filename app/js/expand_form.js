// window.$ = window.jQuery = require('../node_modules/jquery/dist/jquery.min.js');

function AllInputsFilled() {
  return $("input[type='text']", $("#regel1")).filter(function () {
    return $(this).val().trim() === "";
  }).size() === 0;
}

function AdditionEvent() {
  console.log('key upped');
  if (AllInputsFilled()) {
    AddInput();
  }
}

function AddInput() {
  var cnt = $("input[type='text']", $("#regel1")).size() + 1;
  $("<br><span>" + cnt + "</span><input type='text' name='regel" + cnt + "' id='regel" + cnt + "' />").insertAfter("#achievementf1 input[type='text']:last");
  $("input", $("#regel1")).unbind("keyup").bind("keyup", function () { AdditionEvent() });

}

$("#regel1").bind("keyup", function () { AdditionEvent() });