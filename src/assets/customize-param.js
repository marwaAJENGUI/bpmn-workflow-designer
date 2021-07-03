function onInputChange(listId,inputId) {
    let list = document.getElementById(listId);
    let listValue = list.value;
    let input=document.getElementById(inputId);
    input.value=listValue;
    console.log("input value="+input.value);
}
