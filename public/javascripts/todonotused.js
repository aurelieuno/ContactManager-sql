/* global _ */

$(document).ready(function() {

    $(".btn.btn-danger").hide();
    $(".btn.btn-info").hide();

    $.get( "/ajax", function( data ) {
        let list = data;
        console.dir(data);

        _.forEach(list, function(contact) {
            $("#contactlist").append($('<li>').attr("class","contact1").html(contact.name))
        })

                   // var createTable = function(list) {
            //     var createRow = function(contact) {
            //         var $row = $("<tr>").attr("class","contact1");
            //         var $name = $("<td>").text(contact.name);
            //         //var $email = $("<td>").text(contact.email);
            //         $row.append($name);
            //         //$row.append($email);
            //         return $row;
            //     };
            //     var $table = $("<table>");
            //     var $rows = _.map(list, createRow);
            //     $table.append($rows);
            //     return $table;
            // };
            // createTable(list).attr('id', 'tabl').appendTo($('#contactlist'));

        $('.contact1').on({
            'click': function() {
                let foundcnt= _.find(data, {'name' : $(this).text()})
                console.dir("foundcontact "+foundcnt)
                $("#name").val(foundcnt.name);
                $("#email").val(foundcnt.email);
                $("#phone").val(foundcnt.phone);
                $(".btn.btn-primary").hide();
                $(".btn.btn-danger").show();
                $(".btn.btn-info").show();
                $("#title").html("Selected Contact")

                }
            })

$(".btn.btn-danger").click(function(){
  name=$("#name").val();
  console.dir("name :"+name);
  phone=$("#phone").val();
  email=$('#email').val();

fetch('delete', {
  method: 'post',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    'name': name,
    'email': email,
    "phone" : phone
  })
})
.then(res => {
  if (res.ok) return res.json();

})
.then(data => {
  console.dir("data: "+data.name);//this is the last previous entered quote
  //window.location.reload(true)
})
})


// $(".btn.btn-danger").click(function(){
//   name=$("#name").val();
//   console.dir("name "+name);
//   phone=$("#phone").val();
//   email=$('#email').val();
//    $.post( "/delete", {
//     'name': name,
//     'email': email,
//     "phone" : phone
//   }, function( data ) {
//     console.dir("data "+data.name);
//     console.dir("data "+data.phone);
//     console.dir("data "+data.email);
//     //window.location.reload(true)
//    })
// })



/**The first callback parameter data holds the content of the page requested,

data =
value:Object
name:"49"
quote:"49"
_id:"5910956d2018c81b60639594"

server side
req.body name 50 quote 50

Now, whenever someone clicks on the update button, the browser will send a PUT request through Fetch
to our Express server. Then, the server responds by sending the changed quote back to fetch. We can
then handle the response within by chaining fetch with a then method. This is possible because Fetch
 returns a Promise object.
The proper way to check if fetch resolved successfully is to use the okmethod on the response object.
 You can then return res.json() if you want to read the data that was sent from the server:
If you are working on a fancy webapp, this is the part where you use JavaScript to update the DOM so
users can see the new changes immediately. Updating the DOM is out of the scope of this article,
 so we’re just going to refresh the browser to see the changes.

**/




});
});