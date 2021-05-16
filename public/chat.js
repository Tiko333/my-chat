$(function () {
    let changeColors = () => {
        $('.mes-div').css('background-color', '#3399ff');
        $('.me').css('background-color', 'white');
        setTimeout(() => {
            $('.mes-div').css('background-color', '#eaebf0');
            $('.me').css('background-color', '#41A8FF');
        }, 0)
    }

    let new_message = new Audio('message.mp3');
    let send = new Audio('send2.mp3');
    let on_typing = new Audio('on_typing.mp3');

    let element = document.getElementById("chatroom");
    element.style = "scroll-behavior: auto";
    element.scrollTop = element.scrollHeight;

    let socket = io.connect('http://localhost:3000')

    let username = $('.myUsername').attr("data-username");
    let friendUsername = $('.myUsername').attr("data-friendUsername");

    socket.emit('change_username', {username});
    socket.emit('user_room', {username, friendUsername});

    let message = $("#message")
    let send_message = $("#send_message")
    let chatroom = $("#chatroom")
    let typing = $("#typing")
    let typing_div = $(".typing-div");

    send_message.click(function () {
        if (message.val() !== '') {
            send.play().then(m => {
                console.log(m)
            });
            socket.emit('new_message', {message: message.val(), username, friendUsername})
        }
    })

    function replace(message) {
        return message.replace(/</g, "&lt");
    }

    socket.on("new_message", (data) => {
        socket.emit('not typing')
        message.val('');

        if (data.username === username) {

            for (let i = 0; i < data.message.length; i++) {
                if (data.message.charCodeAt(i) === 10) {
                    data.message.replace(data.message[i], "\n");
                }
            }

            if (data.message.includes('<') || data.message.includes('>')) {
                chatroom.append(`<div class="outer"> <div class="mes-div me"><span class='sp'>${replace(data.message)}</span></div> </div> <br><br>`)
                changeColors();
            } else {
                chatroom.append(`<div class="outer"> <div class="mes-div me"><span class='sp'>${data.message}</span></div> </div> <br><br>`)
                changeColors();
            }
        } else {
            // Replace < with &lt; and > with &gt;
            if (data.message.includes('<') || data.message.includes('>')) {
                chatroom.append(`<div class="mes-div"><span class='sp'>${replace(data.message)}</span></div><br><br>`)
                changeColors();
                new_message.play().then(m => {
                    console.log(m)
                });
            } else {
                chatroom.append(`<div class="mes-div"><span class='sp'>${data.message}</span></div><br><br>`)
                changeColors();
                new_message.play().then(m => {
                    console.log(m)
                });
            }


        }

        element.style = "scroll-behavior: smooth";
        element.scrollTop = element.scrollHeight;
    })

    let isTyping = false;
    socket.on('typing', (data) => {
        if (!isTyping) {
            on_typing.play().then(m => {
                console.log(m)
            });
            isTyping = true;
        }

        typing.html(`${data.username.length > 45 ? `${data.username.toString().substring(0, 45)}...` : data.username} is typing...`);
    })

    socket.on('not typing', (data) => {
        isTyping = false;
        typing.html('');
    })

    message.on('input', (event) => {
        event.stopPropagation()
        event.preventDefault()
        socket.emit('typing');
        if (message.val() === '') {
            socket.emit('not typing')
        }
    })

    $(document).on('keypress', (event) => {
        let keycode = event.keyCode || event.which;
        if (event.shiftKey) {
            return;
        }
        if (keycode === 13) {
            let count = (message.val().match(/\n/g) || []).length;
            if (message.val().length === count) {
                return;
            }
            if (message.val() !== '') {
                send.play().then(m => {
                    console.log(m)
                });

                socket.emit('new_message', {message: message.val(), username, friendUsername})
            }
        }
    });
});