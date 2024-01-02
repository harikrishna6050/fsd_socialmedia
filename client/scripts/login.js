async function login() {
    let userName = document.getElementById("userName").value;
    let userPwd = document.getElementById("userPwd").value;
    let abody = { name : userName, password: userPwd};

    let response = await fetch('127.0.0.1: 3900', {
        Method: 'POST',
        Headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json'
        },
        Body: abody,
        Cache: 'default'
    });

    console.log(response);

}
