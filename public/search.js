$(function () {
    let socket = io.connect('http://localhost:3000');

    // let username = $('.unn').text();
    let username = $('.unspan').text();

    let search = $("#user-search");
    let users = $(".users");
    let myUsername = $('.list').attr("data-username");

    search.on('click', (data) => {
        $(".my-fl").hide();
        $(".fl").remove();
        $(".list").append(`<div class="fl"></div>`);
        let username = $("#username").val();
        $.ajax({
            url: '/search',
            type: 'POST',
            cache: false,
            data: {username: username, myUsername: myUsername},
            success: function (data) {
                for (let usersKey of data.users) {
                    $(".fl").append(`<p class='users'>${usersKey.username}</p>`);
                }
                users = data;
                $(".users").on('click', (target) => {
                    target.stopPropagation()
                    target.preventDefault()

                    $.ajax({
                        url: '/addFriend',
                        type: 'POST',
                        cache: false,
                        data: {friendUsername: target.currentTarget.innerText, myUsername: myUsername},
                        success: function (data) {
                            if (data.error.length > 0) {
                                $('#username').removeClass('placeholder-grey');
                                $('#username').addClass('placeholder-red');
                                $("#username")[0].value = '';
                                $("#username")[0].placeholder = data.error;
                                $(".fl").remove();
                                $(".list").append(`<div class="fl"></div>`);
                            } else {
                                $('#username').removeClass('placeholder-red');
                                $('#username').addClass('placeholder-grey');
                                getFriends()
                                $(".my-fl").show();
                                $(".fl").hide();
                                socket.emit('friend_adding', {friendUsername: target.currentTarget.innerText, myUsername: myUsername})
                            }
                        },
                        error: function (jqXHR, textStatus, err) {
                            console.log(`text status ${textStatus}, err ' ${err}`);
                        }
                    })
                })
            },
            error: function (jqXHR, textStatus, err) {
                console.log(`text status ${textStatus}, err ' ${err}`);
            }
        })
    });

    function getFriends() {
        $(".fl").hide();
        $(".my-fl").remove();
        $(".list").append(`<div class="my-fl"></div>`);
        $.ajax({
            url: '/friendsList',
            type: 'GET',
            cache: false,
            data: {myUsername} ,
            success: function (data, textStatus, request) {
                for (let friend of data.friends) {
                    $(".my-fl").append(`<p class='my-list ${friend.username}'>${friend.username} </p>`);
                }

                $(".my-list").on('click', (target) => {
                    target.stopPropagation()
                    target.preventDefault()

                    $.ajax({
                        url: '/friend',
                        type: 'GET',
                        cache: false,
                        data: {friendUsername: target.currentTarget.innerText, myUsername: myUsername},
                        success: function (data) {
                            $.ajax({
                                url: '/getToken',
                                type: 'GET',
                                cache: false,
                                data: {username: myUsername},
                                success: function (data, textStatus, request) {

                                    $("#my-username").val(username);
                                    $("#friend-username").val(target.currentTarget.innerText);
                                    $("#token").val(request.getResponseHeader('authorization'));
                                    $("#friend").val(JSON.stringify(data.friend));

                                    socket.emit('user_room', {username: data.username, friendUsername: target.currentTarget.innerText});
                                    $("#form").submit();
                                },
                                error: function (jqXHR, textStatus, err) {
                                    console.log(`text status ${textStatus}, err ' ${err}`);
                                }
                            })
                        },
                        error: function (jqXHR, textStatus, err) {
                            console.log(`text status ${textStatus}, err ' ${err}`);
                        }
                    })
                })
            },
            error: function (jqXHR, textStatus, err) {
                console.log(`text status ${textStatus}, err ' ${err}`);
            }
        })
    }
    getFriends();

    $("#username").on('focus',  (event) => {
        event.stopPropagation()
        event.preventDefault()
        $(".my-fl").hide();
    })

    $("#my-fl-button").on('click',  (event) => {
        $('#username').addClass('placeholder-grey');
        $("#username")[0].value = '';
        $("#username")[0].placeholder = 'username';

        event.stopPropagation()
        event.preventDefault()
        $(".my-fl").show();
        $(".fl").hide();
    })

    socket.on('friends_new_message', (data) => {
        $(`.${data}`).css('background-color', 'red');
    })

    socket.on('friend_adding', () => {
        getFriends();
    })
});