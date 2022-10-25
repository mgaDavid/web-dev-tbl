let modalLogin;
let bsModalLogin;
let modalRegister;
let bsModalRegister;

let isUserLogged = false;
let userId;
let courseId;
let moduleId;
let moduleName;
let activityId;
let activityTitle;
let activityType = 0;
let studentGroup = 0;
let groupId;

const urlBase = 'https://localhost:8000/api';


function googleTranslateElementInit() {
    setTimeout(() => {
        new google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'en,pt', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false }, document.getElementById('google_translate_element'));
    }, 100);
};

function callHome() {
    let url = urlBase + '/home'

    const myInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    const myRequest = new Request(url, myInit);

    fetch(myRequest)
        .then(async(response) => {
            if (!response.ok) {
                alert('Please log in to have access to the full data!');
            } else {
                let template;
                ({ template } = await response.json());

                const html = ejs.render(template);
                $('#mainContent').html(html);
            }
        }).catch((error) => { console.log(error) });
};

function setUpModalVariables() {
    modalLogin = $('#modalLogin');
    bsModalLogin = new bootstrap.Modal(modalLogin, (backdrop = 'static'));
    modalRegister = $('#modalRegister');
    bsModalRegister = new bootstrap.Modal(modalRegister, (backdrop = 'static'));
};

function cleanUpModals() {
    // Register
    document.getElementById('emailRegister').value = '';
    document.getElementById('passwordRegister').value = '';
    document.getElementById('firstNameRegister').value = '';
    document.getElementById('lastNameRegister').value = '';
    document.getElementById('phoneRegister').value = '';
    document.getElementById('statusRegister').innerHTML = '';
    $('#btnSubmitRegister').show();

    // Login
    document.getElementById('usernameLogin').value = '';
    document.getElementById('passwordLogin').value = '';
    document.getElementById('statusLogin').innerHTML = '';
    document.getElementById('passErrorLogin').innerHTML = '';
};

function callModalRegister() {
    if (!modalLogin) {
        setUpModalVariables();
    };
    $('btnSubmitRegister').show();
    bsModalLogin.hide();
    bsModalRegister.show();
};

function callModalLogin() {
    if (!modalLogin) {
        setUpModalVariables();
    };
    $('#btnSubmitLogin').show();
    bsModalRegister.hide();
    bsModalLogin.show();
};

function callMyCourses() {
    let url = urlBase + '/courses/all'
    const token = localStorage.token;

    const myInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`,
        },
    };

    const myRequest = new Request(url, myInit);

    fetch(myRequest)
        .then(async(response) => {
            if (!response.ok) {
                alert('Please log in to have access to the full data!');
            } else {
                let data, template;
                ({ data, template } = await response.json());

                const html = ejs.render(template, { courses: data });
                $('#mainContent').html(html);
            }
        }).catch((error) => { console.log(error) });
};

function callModules(event) {
    const courseName = $(event.path[0]).children().text();
    courseId = event.path[3].id.split('_')[1];

    let url = urlBase + `/courses/modules`
    const token = localStorage.token;

    const body = JSON.stringify({
        user_id: userId,
        course_id: courseId
    });

    const myInit = {
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        Authorization: `Bearer ${token}`,
        body: body
    };

    const myRequest = new Request(url, myInit);

    fetch(myRequest)
        .then(async(response) => {
            if (!response.ok) {
                alert('Please log in to have access to the full data!');
            } else {
                let data, template;
                ({ data, template } = await response.json());

                const html = ejs.render(template, { modules: data, courseName: courseName });
                $('#mainContent').html(html);
            }
        }).catch((error) => { console.log(error) });
};

function callActivities(event) {
    if (event) {
        moduleName = $(event.path[0]).children().text();
        moduleId = event.path[3].id.split('_')[1];
    };

    let urlActivity = urlBase + `/courses/modules/activities`;
    let urlDiscussions = urlBase + `/courses/modules/discussions`;

    const token = localStorage.token;

    let body = JSON.stringify({
        module_id: moduleId,
        user_id: userId,
        course_id: courseId
    });

    let myInit = {
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        Authorization: `Bearer ${token}`,
        body: body
    };

    const requestActivity = new Request(urlActivity, myInit);

    fetch(requestActivity)
        .then(async(response) => {
            if (!response.ok) {
                alert('Please log in to have access to the full data!');
            } else {
                let data, template;
                ({ data, template } = await response.json());

                const isIndividualActivityDone = data[0].activity_done_student_id != null;
                const isGroupActivityDone = data[0].activity_done_group_id != null;
                const isGroupActivityAvailable = data[0].pending_individual_activities == 0;
                groupId = data[0].group_id;

                body = JSON.stringify({
                    module_id: moduleId,
                    user_id: userId,
                    course_id: courseId,
                    group_id: groupId
                });

                myInit = {
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    Authorization: `Bearer ${token}`,
                    body: body
                };

                const requestDiscussions = new Request(urlDiscussions, myInit);

                fetch(requestDiscussions)
                    .then(async(response) => {
                        if (!response.ok) {
                            alert('Please log in to have access to the full data!');
                        } else {
                            const discussions = await response.json();

                            const html = ejs.render(template, {
                                activities: data,
                                discussions: discussions,
                                moduleName: moduleName,
                                moduleId: moduleId,
                                isIndividualActivityDone: isIndividualActivityDone,
                                isGroupActivityDone: isGroupActivityDone,
                                isGroupActivityAvailable: isGroupActivityAvailable,
                            });

                            activityId = data[0].activity_id;
                            activityTitle = data[0].title;

                            $('#mainContent').html(html);
                        }
                    }).catch((error) => { console.log(error) });
            }
        }).catch((error) => { console.log(error) });
};

function submitComment() {
    const message = $('#commentForm').val();

    if (message.length == 0) {
        return;
    } else {
        let url = urlBase + `/courses/modules/discussions/create`;
        const token = localStorage.token;

        const body = JSON.stringify({
            module_id: moduleId,
            user_id: userId,
            message: message,
            group_id: groupId,
        });

        const myInit = {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            Authorization: `Bearer ${token}`,
            body: body
        };

        const myRequest = new Request(url, myInit);

        fetch(myRequest)
            .then(async(response) => {
                if (!response.ok) {
                    alert('Please log in to have access to the full data!');
                } else {
                    callActivities();
                }
            }).catch((error) => { console.log(error) });
    };
};

function callActivity(from_group_activity) {
    let url = urlBase + `/courses/modules/activities/questions`
    const token = localStorage.token;

    const body = JSON.stringify({
        user_id: userId,
        course_id: courseId,
        activity_id: activityId,
        from_group_activity: from_group_activity,
    });

    const myInit = {
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        Authorization: `Bearer ${token}`,
        body: body
    };

    const myRequest = new Request(url, myInit);

    fetch(myRequest)
        .then(async(response) => {
            if (!response.ok) {
                alert('Please log in to have access to the full data!');
            } else {
                activityType = from_group_activity;

                let data, template;
                ({ data, template } = await response.json());

                if (data[0].answer != null) {
                    alert('This activity is already completed!');
                } else {
                    studentGroup = data[0].group_id;

                    const html = ejs.render(template, { activityTitle: activityTitle, questions: data });
                    $('#mainContent').html(html);
                };
            }
        }).catch((error) => { console.log(error) });
};

function submitAnswers() {
    // const questionsHtml = document.getElementsByTagName('input');
    const questionsHtml = document.getElementsByClassName('activity_radio');
    const questionsAmount = document.getElementsByClassName('question_number').length;

    let answeredQuestions = 0;
    let questions = [];

    for (const question of questionsHtml) {
        if (question.type = 'radio') {
            if (question.checked) {
                questions.push([question.name, question.value]);
                answeredQuestions += 1;
            }
        };
    };

    const unansweredQuestions = questionsAmount - answeredQuestions;
    if (unansweredQuestions > 0) {
        alert(`You left ${unansweredQuestions} unanswered questions, please answer them before submitting the activity!`);
    } else {
        let url = urlBase + `/courses/modules/activities/submit`;
        const token = localStorage.token;

        const body = JSON.stringify({
            user_id: userId,
            activity_id: activityId,
            from_group_activity: activityType,
            questions: questions,
            course_id: courseId,
            group_id: studentGroup,
            module_id: moduleId,
        });

        const myInit = {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            Authorization: `Bearer ${token}`,
            body: body
        };

        const myRequest = new Request(url, myInit);

        fetch(myRequest)
            .then(async(response) => {
                if (!response.ok) {
                    alert('Please log in to have access to the full data!');
                } else {
                    callActivities();
                }
            }).catch((error) => { console.log(error) });
    };
};

function uncheckRadioButton(name) {
    const radiosFromQuestion = document.getElementsByName(name);

    for (radio of radiosFromQuestion) {
        $(radio).prop('checked', false);
    };
};

function doLogout() {
    localStorage.removeItem('token');
    $('#btnLogin').show();
    $('#btnSignUp').show();
    $('#btnMyCourses').hide();
    $('#btnLogout').hide();
    callHome();
    isUserLogged = false;
};

function validateSignUp() {
    const email = document.getElementById('emailRegister').value;
    const password = document.getElementById('passwordRegister').value;
    const firstName = document.getElementById('firstNameRegister').value;
    const lastName = document.getElementById('lastNameRegister').value;
    const phone = document.getElementById('phoneRegister').value;

    const statReg = document.getElementById('statusRegister');
    const passwordStatus = document.getElementById('passErrorSignup');

    statReg.innerHTML = '';
    passwordStatus.innerHTML = '';

    if (email.length == 0 || email.length == 0 || email.length == 0 || email.length == 0 || email.length == 0) {
        statReg.innerHTML = 'Please fill all fields!';
        return;
    };

    if (password.length < 4) {
        passwordStatus.innerHTML = 'The password must have at least 4 characters';
        return;
    };

    if (email.length > 320) {
        statReg.innerHTML = 'Please insert a valid email!';
        return;
    };

    if (firstName.length > 80) {
        statReg.innerHTML = 'The First Name field needs to be filled with a maximum of 80 characters!';
        return;
    };

    if (lastName.length > 80) {
        statReg.innerHTML = 'The Last Name field needs to be filled with a maximum of 80 characters!';
        return;
    };

    try {
        const phoneNumber = parseInt(phone);
    } catch (error) {
        statReg.innerHTML = 'The Phone field needs to be filled only with numbers!';
        return;
    };

    const body = JSON.stringify({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
    });

    fetch(`${urlBase}/users/register`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: body
        })
        .then(async(response) => {
            if (!response.ok) {
                let message;
                ({ message } = await response.json());
                throw new Error(message);
            }
            result = await response.json();
            cleanUpModals();
            statReg.innerHTML = result.message;
            $('#btnSubmitRegister').hide();
        })
        .catch((error) => {
            statReg.innerHTML = `${error.message}`;
        });
};

function validateLogin() {
    const email = document.getElementById('usernameLogin').value;
    const password = document.getElementById('passwordLogin').value;
    const statusLogin = document.getElementById('statusLogin');
    const passErrorLogin = document.getElementById('passErrorLogin');

    statusLogin.innerHTML = '';
    passErrorLogin.innerHTML = '';

    if (email.length == 0 || password.length == 0) {
        statusLogin.innerHTML = 'Please provide your credentials.';
        return;
    };

    if (password.length < 4) {
        passErrorLogin.innerHTML = 'The password must have at least 4 characters.';
        return;
    };

    const body = JSON.stringify({
        email: email,
        password: password,
    });

    fetch(`${urlBase}/users/login`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: body
        })
        .then(async(response) => {
            if (!response.ok) {
                error = await response.json();
                throw new Error(error.message);
            };
            result = await response.json();
            userId = result.userId;
            const token = result.accessToken;
            localStorage.setItem('token', token);

            document.getElementById('statusLogin').innerHTML = 'Success!';

            document.getElementById('btnLoginClose').click();
            $('#btnLogin').hide();
            $('#btnSignUp').hide();
            document.getElementById('btnLogout').style.display = 'block';
            document.getElementById('btnMyCourses').style.display = 'block';
            $('#btnLogout').show();
            $('#btnMyCourses').show();
            callMyCourses();
            isUserLogged = true;
        })
        .catch(async(error) => {
            statusLogin.innerHTML = error.message;
        });
};

function callStartNow() {
    if (isUserLogged) {
        callMyCourses();
    } else {
        callModalRegister();
    }
};
