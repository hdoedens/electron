function AllInputsFilled() {
    return $("input[type='text']", $("#achievementf1")).filter(function() {
        return $(this).val().trim() === "";
    }).size() === 0;
}

function AdditionEvent() {
    if (AllInputsFilled()) {
        AddInput();    
    }
}

function AddInput() {
    var cnt = $("input[type='text']", $("#achievementf1")).size() + 1;
    $("<br><span>" + cnt + "</span><input type='text' name='achievement" + cnt+ "' id='achievement" + cnt+ "' />").insertAfter("#achievementf1 input[type='text']:last");
    $("input", $("#achievementf1")).unbind("keyup").bind("keyup", function(){ AdditionEvent() });

}

$("input", $("#achievementf1")).bind("keyup", function(){ AdditionEvent() });