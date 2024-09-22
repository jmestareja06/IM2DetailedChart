import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {getFirestore, setDoc, doc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

//Config
const firebaseConfig = {
    apiKey: "AIzaSyD7PCgMal0Dtz6x4ymo4nv-XciO03Wvgmc",
    authDomain: "im2-project-chart.firebaseapp.com",
    projectId: "im2-project-chart",
    storageBucket: "im2-project-chart.appspot.com",
    messagingSenderId: "978935866532",
    appId: "1:978935866532:web:c4dbed8be1038c4a177231",
    measurementId: "G-XW34L1R138"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);



document.addEventListener('DOMContentLoaded', async () => {
    const numberOfusers = await getDatausers();
    BarChart(numberOfusers);
    PieChart(numberOfusers);
    document.body.insertAdjacentHTML('beforeend', `<footer style="position: fixed; bottom: 0; width: 100%; text-align: center; color: gray; font-size: 12px;">@credits by jmestareja06</footer>`);

});


// Registration Function
const registration = document.getElementById("registration");
if (registration) {
    registration.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const country = document.getElementById("country").value;

        try {
            await setDoc(doc(db, "users", username), {
                username: username,
                email: email,
                country: country
            });

            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
            });
            registration.reset();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Registration error',
            })
        }
    });
};






//Bar Charts
 async function getDatausers() {
    const userCountCountry = {};
    const querySnapshot = await getDocs(collection(db, "users"));

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const country = data.country;

        if (userCountCountry[country]) {
            userCountCountry[country]++;
        } else {
            userCountCountry[country] = 1;
        }
    });
    return userCountCountry;
}



//bar chart
async function BarChart(countryData) {
    const countries = Object.keys(countryData);
    const counts = Object.values(countryData);

    const ctxBar = document.getElementById('BarChart');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                label: 'Users',
                data: counts,
                backgroundColor: [
                    'rgba(80, 40, 233, 0.2)',
                    'rgba(255, 22, 119, 0.2)',
                    'rgba(136, 173, 255, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 137, 97, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(199, 199, 199, 0.2)',
                    'rgba(83, 102, 255, 0.2)',
                    'rgba(243, 56, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(80, 40, 233, 1)',
                    'rgba(255, 22, 119, 1)',
                    'rgba(136, 173, 255, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 137, 97, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                    'rgba(243, 56, 132, 1)',
                ],
                borderWidth: 1,
                barThickness: 30

            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            onHover: (event, chartElement) => {
                const chartCanvas = event.native.target;
                chartCanvas.style.cursor = chartElement.length ? 'pointer' : 'default';
        }
        }
    });
}


//pie chart
async function PieChart(countryData) {
    const countries = Object.keys(countryData);
    const counts = Object.values(countryData);

    const ctxPie = document.getElementById('PieChart');
    new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: countries,
            datasets: [{
                data: counts,
                backgroundColor: [
                    'rgba(80, 40, 233, 0.2)',
                    'rgba(255, 22, 119, 0.2)',
                    'rgba(75, 192, 255, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 137, 97, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(199, 199, 199, 0.2)',
                    'rgba(83, 102, 255, 0.2)',
                    'rgba(243, 56, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(80, 40, 233, 1)',
                    'rgba(255, 22, 119, 1)',
                    'rgba(75, 192, 255, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 137, 97, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                    'rgba(243, 56, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            cutout: '50%',
            onHover: (event, chartElement) => {
                const chartCanvas = event.native.target;
                chartCanvas.style.cursor = chartElement.length ? 'pointer' : 'default';
        }}
    });
}



//Download button
document.getElementById('download').addEventListener('click', () => {
    Swal.fire({
        title: 'Please input your email and password for confirmation',
        html: `
            <input type="email" id="email" class="swal2-input" placeholder="Enter your email">
            <input type="password" id="password" class="swal2-input" placeholder="Enter your password">
        `,
        confirmButtonText: 'Confirm',
        focusConfirm: false,
        preConfirm: () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (!email || !password) {
                Swal.showValidationMessage(`Please enter a valid email and password`);
            }
            return { email: email, password: password };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { email, password } = result.value;
            if (email && password) {
                exportDetails();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Your email was not authorized',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    });
});

async function exportDetails() {
    const user = auth.currentUser;
    if (user) {
        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs.map(doc => ({
            ...doc.data()
        }));
        const filename = 'UserDetails-Chart.xlsx';
        const worksheet = XLSX.utils.json_to_sheet(users);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        XLSX.writeFile(workbook, filename);
    } else {
        Swal.fire('Not authenticated', 'You need to login to download the file.', 'error');
    }
}