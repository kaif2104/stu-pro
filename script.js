
document.addEventListener("DOMContentLoaded", () => {
    const credentials = {
        teacher: { username: "teacher1", password: "teach123" },
        parent: { username: "parent1", password: "parent123" }
    };

    const students = [
        { name: "SALMAN", roll: "1" },
        { name: "SHUBH", roll: "2" },
        { name: "SIDHU", roll: "3" },
        { name: "KARAN", roll: "4" },
        { name: "RIRIK", roll: "5" },
        { name: "AYUSH", roll: "6" },
        { name: "DHONI", roll: "7" },
        { name: "GILL", roll: "8" },
        { name: "VIRAT", roll: "9" },
        { name: "ROHIT", roll: "10" }
    ];

    let attendance = JSON.parse(localStorage.getItem("attendance")) || new Array(students.length).fill(false);

    const loginContainer = document.getElementById("loginContainer");
    const studentListContainer = document.getElementById("studentListContainer");
    const attendanceContainer = document.getElementById("attendanceContainer");
    const finalAttendanceContainer = document.getElementById("finalAttendanceContainer");

    const studentList = document.getElementById("studentList");
    const attendanceBody = document.getElementById("attendanceBody");
    const finalPresentBody = document.getElementById("finalPresentBody");
    const finalAbsentBody = document.getElementById("finalAbsentBody");

    const loginBtn = document.getElementById("loginBtn");
    const loginError = document.getElementById("loginError");

    const proceedToAttendanceBtn = document.getElementById("proceedToAttendanceBtn");
    const submitAttendanceBtn = document.getElementById("submitAttendanceBtn");

    function renderStudentList() {
        studentList.innerHTML = "";
        students.forEach((student) => {
            const li = document.createElement("li");
            li.textContent = `${student.name} (${student.roll})`;
            studentList.appendChild(li);
        });
    }

    function renderAttendanceForm() {
        attendanceBody.innerHTML = "";
        students.forEach((student, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.roll}</td>
                <td><input type="checkbox" data-index="${index}" class="attendanceCheckbox" ${attendance[index] ? 'checked' : ''}></td>
            `;
            attendanceBody.appendChild(row);
        });
    }

    function renderFinalAttendance() {
        finalPresentBody.innerHTML = "";
        finalAbsentBody.innerHTML = "";

        students.forEach((student, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${student.name}</td><td>${student.roll}</td>`;
            if (attendance[index]) {
                finalPresentBody.appendChild(row);
            } else {
                finalAbsentBody.appendChild(row);
            }
        });
    }

    loginBtn.addEventListener("click", () => {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (username === credentials.teacher.username && password === credentials.teacher.password) {
            loginContainer.style.display = "none";
            studentListContainer.style.display = "block";
            renderStudentList();
        } else if (username === credentials.parent.username && password === credentials.parent.password) {
            loginContainer.style.display = "none";
            finalAttendanceContainer.style.display = "block";
            renderFinalAttendance();
        } else {
            loginError.textContent = "Invalid credentials!";
        }
    });

    proceedToAttendanceBtn.addEventListener("click", () => {
        studentListContainer.style.display = "none";
        attendanceContainer.style.display = "block";
        renderAttendanceForm();
    });

    submitAttendanceBtn.addEventListener("click", () => {
        attendance = [];
        const checkboxes = document.querySelectorAll(".attendanceCheckbox");
        checkboxes.forEach((cb) => {
            attendance[cb.dataset.index] = cb.checked;
        });
        localStorage.setItem("attendance", JSON.stringify(attendance));

        attendanceContainer.style.display = "none";
        finalAttendanceContainer.style.display = "block";
        renderFinalAttendance();
    });
});
