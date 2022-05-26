
async function signupFormHandler(event) {
    event.preventDefault();
  
    // take user's inputs from login.handlebars and assign to variables
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
  
    //if all fields have values, make a fetch post request to /api/users route
    if (username && email && password) {
      const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
          username,
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      // check the response status using .ok property on response object
    if (response.ok) {
        console.log('success');
        document.location.replace('/dashboard/');
      } else {
        alert(response.statusText);
      }
    }
  }
  




document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);