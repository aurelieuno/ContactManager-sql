/* global _ */

$(document).ready(function() {

    $("#createlist").hide();

    $.get( "/dashboard/ajax", function( data ) {
        let list = data;
        console.dir(data);

        _.forEach(list, function(contact) {
            $("#contactlist").append($('<li>').attr("class","contact1").html(contact.name))
        })

        $("#contactlist").append($('<button type="button" class="btn btn-warning">New</button>'))

        $(".btn.btn-warning").click(function(){
             $("#createlist").show();
             $(".btn.btn-primary").show();
             $(".btn.btn-danger").hide();
             $(".btn.btn-info").hide();
             $("#title").html("Create Contact")
         })

        var foundcnt;

        $('.contact1').on({
            'click': function() {
                $("#createlist").show();
                $(".btn.btn-primary").hide();
                $(".btn.btn-danger").show();
                $(".btn.btn-info").show();
                $("#title").html("Selected Contact")

                foundcnt= _.find(data, {'name' : $(this).text()})
                console.dir("foundcontact")
                console.dir(foundcnt)
                $("#name").val(foundcnt.name);
                $("#email").val(foundcnt.email);
                $("#phone").val(foundcnt.phone);
                }
            })

$(".btn.btn-info").click(function(){
  let foundid = foundcnt.id;
  console.dir(foundid);

  name=$("#name").val();
  phone=$("#phone").val();
  email=$('#email').val();

   $.post( "/dashboard/update", {
    "id" : foundid,
    'name': name,
    'email': email,
    "phone" : phone
  }, function( data ) {
    window.location.reload(true)
   })
})


$(".btn.btn-danger").click(function(){
  let foundid = foundcnt.id;

  name=$("#name").val();
  phone=$("#phone").val();
  email=$('#email').val();
   $.post( "/dashboard/delete", {
    "id" : foundid,
    'name': name,
    'email': email,
    "phone" : phone
  }, function( data ) {
    window.location.reload(true)
   })
})



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
