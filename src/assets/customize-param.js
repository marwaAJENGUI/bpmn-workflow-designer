function onAssigneeChange() {
   /* let userList = document.getElementById("select-user");
    let userId = userList.value;
    let assignee=document.getElementById("camunda-assignee");
    assignee.value=userId;
    console.log(assignee);
    */
    console.log("ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss");
    let userList = document.getElementById("select-user");
    let userId = userList.value;
    let assignee=document.getElementById("camunda-assignee");
    assignee.value=userId;
    assignee.onchange();
    console.log(userId);
    console.log(assignee.value);
}