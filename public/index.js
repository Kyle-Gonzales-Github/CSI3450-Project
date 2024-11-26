async function loadActors() {
    try {
        const response = await fetch('/data');
        const result = await response.json();
        const actorsTable = document.getElementById('actorsTable').getElementsByTagName('tbody')[0];
        actorsTable.innerHTML = ''; 

        result.data.forEach(actor => {
            const row = actorsTable.insertRow();
            row.insertCell(0).textContent = actor.firstname;
            row.insertCell(1).textContent = actor.lastname;
            row.insertCell(2).textContent = actor.moviesActedIn;
        });
    } catch (error) {
        console.error('Error loading actors:', error);
    }
}

document.getElementById('actorForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const moviesActedIn = document.getElementById('moviesActedIn').value;

    try {
        const response = await fetch('/add-row', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname, lastname, moviesActedIn })
        });

        const result = await response.json();
        document.getElementById('message').innerText = result.message;


        loadActors();
    } catch (error) {
        document.getElementById('message').innerText = 'Error adding actor.';
        console.error('Error:', error);
    }

    document.getElementById('actorForm').reset();
});

window.onload = loadActors;
