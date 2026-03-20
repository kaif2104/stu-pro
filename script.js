
document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       DATA
    =================================================== */
    const credentials = {
        teacher: { username: "teacher1", password: "teach123", role: "teacher", name: "Mr. Sharma" },
        parent:  { username: "parent1",  password: "parent123", role: "parent",  name: "Parent" }
    };

    const students = [
        { name: "Aarav Sharma",    roll: "01" },
        { name: "Priya Patel",     roll: "02" },
        { name: "Rohan Mehta",     roll: "03" },
        { name: "Ananya Singh",    roll: "04" },
        { name: "Arjun Verma",     roll: "05" },
        { name: "Sneha Gupta",     roll: "06" },
        { name: "Kabir Khan",      roll: "07" },
        { name: "Riya Joshi",      roll: "08" },
        { name: "Vivaan Malhotra", roll: "09" },
        { name: "Ishaan Nair",     roll: "10" }
    ];

    const events = [
        {
            icon: "🏆",
            title: "Annual Sports Day",
            date: "2026-03-25",
            description: "A full day of athletic events including track and field, team sports, and relay races. All students are encouraged to participate and represent their house.",
            venue: "School Ground",
            category: "Sports",
            color: "#F59E0B",
            status: "upcoming"
        },
        {
            icon: "🔬",
            title: "Science Exhibition",
            date: "2026-04-05",
            description: "Students showcase innovative science projects. Distinguished judges from top institutions will evaluate entries and award prizes in multiple categories.",
            venue: "School Hall",
            category: "Academic",
            color: "#3B82F6",
            status: "upcoming"
        },
        {
            icon: "👨‍👩‍👧",
            title: "Parent-Teacher Meeting",
            date: "2026-04-15",
            description: "An interactive session for parents to discuss their child's academic progress, attendance, behavior, and goals for the upcoming term.",
            venue: "Classrooms",
            category: "Meeting",
            color: "#8B5CF6",
            status: "upcoming"
        },
        {
            icon: "🎨",
            title: "Art & Craft Competition",
            date: "2026-05-10",
            description: "Express your creativity! Students compete in painting, sculpture, and craft categories. Prizes awarded for the top three in each category.",
            venue: "Art Room",
            category: "Cultural",
            color: "#EC4899",
            status: "upcoming"
        },
        {
            icon: "🇮🇳",
            title: "Independence Day Celebration",
            date: "2025-08-15",
            description: "A grand celebration featuring flag hoisting, patriotic songs, cultural performances, and inspiring speeches by students and teaching staff.",
            venue: "School Ground",
            category: "National",
            color: "#10B981",
            status: "past"
        },
        {
            icon: "🎭",
            title: "Annual Cultural Function",
            date: "2025-12-20",
            description: "A spectacular evening of dance, drama, music, and skits performed by talented students — the most-awaited event of the school year!",
            venue: "School Auditorium",
            category: "Cultural",
            color: "#6366F1",
            status: "past"
        },
        {
            icon: "📚",
            title: "Inter-School Quiz Competition",
            date: "2025-11-10",
            description: "Students from our school competed against 12 other schools in general knowledge, science, and current affairs. Our team secured 2nd place overall!",
            venue: "District Hall",
            category: "Academic",
            color: "#14B8A6",
            status: "past"
        }
    ];

    /* Exam results — 5 subjects × 100 marks each */
    const results = [
        { name: "Aarav Sharma",    roll: "01", math: 88, science: 76, english: 82, social: 79, computer: 91 },
        { name: "Priya Patel",     roll: "02", math: 72, science: 68, english: 75, social: 80, computer: 85 },
        { name: "Rohan Mehta",     roll: "03", math: 91, science: 89, english: 78, social: 85, computer: 94 },
        { name: "Ananya Singh",    roll: "04", math: 65, science: 71, english: 69, social: 74, computer: 78 },
        { name: "Arjun Verma",     roll: "05", math: 55, science: 60, english: 62, social: 58, computer: 65 },
        { name: "Sneha Gupta",     roll: "06", math: 83, science: 87, english: 90, social: 88, computer: 86 },
        { name: "Kabir Khan",      roll: "07", math: 78, science: 75, english: 73, social: 77, computer: 80 },
        { name: "Riya Joshi",      roll: "08", math: 45, science: 52, english: 58, social: 50, computer: 48 },
        { name: "Vivaan Malhotra", roll: "09", math: 96, science: 93, english: 88, social: 91, computer: 97 },
        { name: "Ishaan Nair",     roll: "10", math: 70, science: 73, english: 76, social: 72, computer: 82 }
    ];

    const SUBJECTS_MAX = 500; // 5 subjects × 100

    /* ===================================================
       STATE
    =================================================== */
    let attendance  = JSON.parse(localStorage.getItem("attendance")) || new Array(students.length).fill(false);
    let currentUser = null;
    let eventFilter = "all";

    /* ===================================================
       DOM REFERENCES
    =================================================== */
    const loginScreen  = document.getElementById("loginScreen");
    const mainApp      = document.getElementById("mainApp");
    const navLinksEl   = document.getElementById("navLinks");
    const navUsername  = document.getElementById("navUsername");
    const logoutBtn    = document.getElementById("logoutBtn");

    const sections = {
        dashboard:       document.getElementById("dashboardSection"),
        studentList:     document.getElementById("studentListSection"),
        attendance:      document.getElementById("attendanceSection"),
        finalAttendance: document.getElementById("finalAttendanceSection"),
        events:          document.getElementById("eventsSection"),
        results:         document.getElementById("resultsSection")
    };

    /* ===================================================
       HELPERS
    =================================================== */
    function showSection(name) {
        Object.values(sections).forEach(s => { s.style.display = "none"; });
        sections[name].style.display = "block";
        document.querySelectorAll(".nav-link").forEach(l => {
            l.classList.toggle("active", l.dataset.section === name);
        });
    }

    function getGrade(pct) {
        if (pct >= 90) return { grade: "A+", cls: "grade-A" };
        if (pct >= 80) return { grade: "A",  cls: "grade-A" };
        if (pct >= 70) return { grade: "B",  cls: "grade-B" };
        if (pct >= 60) return { grade: "C",  cls: "grade-C" };
        if (pct >= 50) return { grade: "D",  cls: "grade-D" };
        return           { grade: "F",  cls: "grade-D" };
    }

    function getTotal(r) {
        return r.math + r.science + r.english + r.social + r.computer;
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric"
        });
    }

    function updateAttendanceCounts() {
        const checkboxes = document.querySelectorAll(".attendanceCheckbox");
        let present = 0;
        checkboxes.forEach(cb => { if (cb.checked) present++; });
        document.getElementById("presentCount").textContent = present;
        document.getElementById("absentCount").textContent  = students.length - present;
    }

    /* ===================================================
       RENDER — NAVBAR
    =================================================== */
    function renderNavbar(role) {
        const teacherLinks = [
            { section: "dashboard",       label: "📊 Dashboard"  },
            { section: "studentList",     label: "👥 Students"   },
            { section: "finalAttendance", label: "📋 Attendance" },
            { section: "events",          label: "📅 Events"     },
            { section: "results",         label: "📝 Results"    }
        ];
        const parentLinks = [
            { section: "dashboard",       label: "📊 Dashboard"  },
            { section: "finalAttendance", label: "📋 Attendance" },
            { section: "events",          label: "📅 Events"     },
            { section: "results",         label: "📝 Results"    }
        ];
        const links = role === "teacher" ? teacherLinks : parentLinks;
        navLinksEl.innerHTML = links.map(l =>
            `<button class="nav-link" data-section="${l.section}">${l.label}</button>`
        ).join("");

        navLinksEl.querySelectorAll(".nav-link").forEach(btn => {
            btn.addEventListener("click", () => navigateTo(btn.dataset.section));
        });
    }

    /* ===================================================
       RENDER — DASHBOARD
    =================================================== */
    function renderDashboard(role) {
        const presentCount  = attendance.filter(Boolean).length;
        const upcomingCount = events.filter(e => e.status === "upcoming").length;

        document.getElementById("statsGrid").innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-value">${students.length}</div>
                <div class="stat-label">Total Students</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-value" style="color:#059669">${presentCount}</div>
                <div class="stat-label">Present Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">❌</div>
                <div class="stat-value" style="color:#DC2626">${students.length - presentCount}</div>
                <div class="stat-label">Absent Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-value">${upcomingCount}</div>
                <div class="stat-label">Upcoming Events</div>
            </div>
        `;

        const teacherActions = `
            <div class="action-card" data-target="studentList">
                <div class="action-icon">📋</div>
                <h3>Mark Attendance</h3>
                <p>Record today's student attendance quickly and efficiently</p>
            </div>
            <div class="action-card" data-target="finalAttendance">
                <div class="action-icon">📊</div>
                <h3>Attendance Report</h3>
                <p>View present and absent students with statistics</p>
            </div>
            <div class="action-card" data-target="events">
                <div class="action-icon">📅</div>
                <h3>School Events</h3>
                <p>Browse upcoming and past school events</p>
            </div>
            <div class="action-card" data-target="results">
                <div class="action-icon">📝</div>
                <h3>Exam Results</h3>
                <p>View student performance, grades and rankings</p>
            </div>
        `;
        const parentActions = `
            <div class="action-card" data-target="finalAttendance">
                <div class="action-icon">📊</div>
                <h3>Attendance Report</h3>
                <p>Check today's attendance status for the class</p>
            </div>
            <div class="action-card" data-target="events">
                <div class="action-icon">📅</div>
                <h3>School Events</h3>
                <p>Stay updated with upcoming school events and activities</p>
            </div>
            <div class="action-card" data-target="results">
                <div class="action-icon">📝</div>
                <h3>Exam Results</h3>
                <p>View exam results and class rankings</p>
            </div>
        `;

        const qaEl = document.getElementById("quickActions");
        qaEl.innerHTML = role === "teacher" ? teacherActions : parentActions;
        qaEl.querySelectorAll(".action-card").forEach(card => {
            card.addEventListener("click", () => navigateTo(card.dataset.target));
        });
    }

    /* ===================================================
       RENDER — STUDENT LIST
    =================================================== */
    function renderStudentList() {
        const query    = document.getElementById("studentSearch").value.toLowerCase();
        const filtered = students.filter(s =>
            s.name.toLowerCase().includes(query) || s.roll.includes(query)
        );
        document.getElementById("studentGrid").innerHTML = filtered.map(s => `
            <div class="student-card">
                <div class="student-avatar">${s.name[0]}</div>
                <h4>${s.name}</h4>
                <span class="roll-badge">Roll: ${s.roll}</span>
            </div>
        `).join("");
    }

    /* ===================================================
       RENDER — ATTENDANCE FORM
    =================================================== */
    function renderAttendanceForm() {
        const today = new Date().toLocaleDateString("en-IN", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        });
        document.getElementById("attendanceDateBadge").textContent = today;

        const tbody = document.getElementById("attendanceBody");
        tbody.innerHTML = "";

        students.forEach((student, i) => {
            const checked = attendance[i];
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${i + 1}</td>
                <td><strong>${student.name}</strong></td>
                <td>${student.roll}</td>
                <td>
                    <div class="checkbox-wrapper">
                        <input type="checkbox" class="attendanceCheckbox present-toggle"
                               data-index="${i}" ${checked ? "checked" : ""}>
                        <span class="${checked ? "status-present" : "status-absent"}" id="status-${i}">
                            ${checked ? "✅ Present" : "❌ Absent"}
                        </span>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll(".attendanceCheckbox").forEach(cb => {
            cb.addEventListener("change", () => {
                const idx = cb.dataset.index;
                const el  = document.getElementById(`status-${idx}`);
                el.textContent = cb.checked ? "✅ Present" : "❌ Absent";
                el.className   = cb.checked ? "status-present" : "status-absent";
                updateAttendanceCounts();
            });
        });

        updateAttendanceCounts();
    }

    /* ===================================================
       RENDER — FINAL ATTENDANCE REPORT
    =================================================== */
    function renderFinalAttendance() {
        attendance = JSON.parse(localStorage.getItem("attendance")) || new Array(students.length).fill(false);

        const presentBody = document.getElementById("finalPresentBody");
        const absentBody  = document.getElementById("finalAbsentBody");
        presentBody.innerHTML = "";
        absentBody.innerHTML  = "";

        let presentCount = 0;
        students.forEach((student, i) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${student.name}</td><td>${student.roll}</td>`;
            if (attendance[i]) {
                presentBody.appendChild(row);
                presentCount++;
            } else {
                absentBody.appendChild(row);
            }
        });

        const pct = Math.round((presentCount / students.length) * 100);
        document.getElementById("presentTotal").textContent      = presentCount;
        document.getElementById("absentTotal").textContent       = students.length - presentCount;
        document.getElementById("attendancePercentage").textContent = `${pct}%`;
    }

    /* ===================================================
       RENDER — EVENTS
    =================================================== */
    function renderEvents(filter) {
        const filtered = events.filter(e => filter === "all" || e.status === filter);
        const grid = document.getElementById("eventsGrid");

        if (filtered.length === 0) {
            grid.innerHTML = "<p style='color:white;text-align:center;padding:40px;'>No events found.</p>";
            return;
        }

        grid.innerHTML = filtered.map(e => `
            <div class="event-card">
                <div class="event-header" style="background:${e.color}18; border-left:4px solid ${e.color};">
                    <div class="event-icon-wrap">${e.icon}</div>
                    <div>
                        <div class="event-category" style="color:${e.color}">${e.category}</div>
                        <span class="event-date-badge" style="background:${e.color}">${formatDate(e.date)}</span>
                    </div>
                </div>
                <div class="event-body">
                    <div class="event-title">${e.title}</div>
                    <div class="event-description">${e.description}</div>
                    <div class="event-meta">
                        <span class="event-tag" style="background:${e.color}18;color:${e.color}">
                            📍 ${e.venue}
                        </span>
                        <span class="event-tag" style="background:${e.status === "upcoming" ? "#D1FAE5" : "#F3F4F6"};color:${e.status === "upcoming" ? "#065F46" : "#6B7280"}">
                            ${e.status === "upcoming" ? "🟢 Upcoming" : "⚫ Past"}
                        </span>
                    </div>
                </div>
            </div>
        `).join("");
    }

    /* ===================================================
       RENDER — RESULTS
    =================================================== */
    function renderResults(role) {
        const container = document.getElementById("resultsContent");

        if (role === "teacher") {
            container.innerHTML = `
                <div class="results-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Roll</th><th>Name</th>
                                <th>Math</th><th>Science</th><th>English</th>
                                <th>Social</th><th>Computer</th>
                                <th>Total</th><th>%</th><th>Grade</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.map(r => {
                                const tot  = getTotal(r);
                                const pct  = Math.round((tot / SUBJECTS_MAX) * 100);
                                const { grade, cls } = getGrade(pct);
                                const pass = tot >= SUBJECTS_MAX * 0.33;
                                return `
                                    <tr>
                                        <td>${r.roll}</td>
                                        <td><strong>${r.name}</strong></td>
                                        <td>${r.math}</td>
                                        <td>${r.science}</td>
                                        <td>${r.english}</td>
                                        <td>${r.social}</td>
                                        <td>${r.computer}</td>
                                        <td><strong>${tot}/${SUBJECTS_MAX}</strong></td>
                                        <td>${pct}%</td>
                                        <td class="${cls}">${grade}</td>
                                        <td>
                                            <span class="pass-badge ${pass ? "pass" : "fail"}">
                                                ${pass ? "Pass" : "Fail"}
                                            </span>
                                        </td>
                                    </tr>
                                `;
                            }).join("")}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            /* Parent view — ranked list */
            const ranked = [...results]
                .map(r => ({ ...r, total: getTotal(r) }))
                .sort((a, b) => b.total - a.total);

            container.innerHTML = `
                <p class="results-intro">
                    Class results ranked by total marks. Contact the teacher for detailed subject-wise assessment.
                </p>
                <div class="results-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Rank</th><th>Name</th>
                                <th>Total (${SUBJECTS_MAX})</th><th>Percentage</th>
                                <th>Grade</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ranked.map((r, idx) => {
                                const pct  = Math.round((r.total / SUBJECTS_MAX) * 100);
                                const { grade, cls } = getGrade(pct);
                                const pass = r.total >= SUBJECTS_MAX * 0.33;
                                const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1;
                                return `
                                    <tr ${idx === 0 ? 'class="topper-row"' : ""}>
                                        <td>${medal}</td>
                                        <td><strong>${r.name}</strong></td>
                                        <td><strong>${r.total}/${SUBJECTS_MAX}</strong></td>
                                        <td>${pct}%</td>
                                        <td class="${cls}">${grade}</td>
                                        <td>
                                            <span class="pass-badge ${pass ? "pass" : "fail"}">
                                                ${pass ? "Pass" : "Fail"}
                                            </span>
                                        </td>
                                    </tr>
                                `;
                            }).join("")}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }

    /* ===================================================
       NAVIGATION
    =================================================== */
    function navigateTo(section) {
        switch (section) {
            case "dashboard":       renderDashboard(currentUser.role);    break;
            case "studentList":     renderStudentList();                   break;
            case "finalAttendance": renderFinalAttendance();               break;
            case "events":          renderEvents(eventFilter);             break;
            case "results":         renderResults(currentUser.role);       break;
            case "attendance":      renderAttendanceForm();                break;
        }
        showSection(section);
    }

    /* ===================================================
       LOGIN
    =================================================== */
    document.getElementById("loginBtn").addEventListener("click", () => {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const errEl    = document.getElementById("loginError");

        if (username === credentials.teacher.username && password === credentials.teacher.password) {
            currentUser = credentials.teacher;
        } else if (username === credentials.parent.username && password === credentials.parent.password) {
            currentUser = credentials.parent;
        } else {
            errEl.textContent = "❌ Invalid username or password. Please try again.";
            return;
        }

        errEl.textContent = "";
        loginScreen.style.display = "none";
        mainApp.style.display     = "block";
        navUsername.textContent   = `👤 ${currentUser.name}`;
        renderNavbar(currentUser.role);
        navigateTo("dashboard");
    });

    /* Allow Enter key to submit login */
    document.getElementById("password").addEventListener("keydown", e => {
        if (e.key === "Enter") document.getElementById("loginBtn").click();
    });

    /* ===================================================
       LOGOUT
    =================================================== */
    logoutBtn.addEventListener("click", () => {
        currentUser = null;
        mainApp.style.display     = "none";
        loginScreen.style.display = "flex";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    });

    /* ===================================================
       STUDENT LIST — SEARCH & PROCEED
    =================================================== */
    document.getElementById("studentSearch").addEventListener("input", renderStudentList);

    document.getElementById("proceedToAttendanceBtn").addEventListener("click", () => {
        navigateTo("attendance");
    });

    /* ===================================================
       ATTENDANCE — MARK ALL / BACK / SUBMIT
    =================================================== */
    document.getElementById("markAllPresent").addEventListener("click", () => {
        document.querySelectorAll(".attendanceCheckbox").forEach(cb => {
            cb.checked = true;
            const el = document.getElementById(`status-${cb.dataset.index}`);
            el.textContent = "✅ Present";
            el.className   = "status-present";
        });
        updateAttendanceCounts();
    });

    document.getElementById("markAllAbsent").addEventListener("click", () => {
        document.querySelectorAll(".attendanceCheckbox").forEach(cb => {
            cb.checked = false;
            const el = document.getElementById(`status-${cb.dataset.index}`);
            el.textContent = "❌ Absent";
            el.className   = "status-absent";
        });
        updateAttendanceCounts();
    });

    document.getElementById("backToStudentListBtn").addEventListener("click", () => {
        navigateTo("studentList");
    });

    document.getElementById("submitAttendanceBtn").addEventListener("click", () => {
        attendance = [];
        document.querySelectorAll(".attendanceCheckbox").forEach(cb => {
            attendance[parseInt(cb.dataset.index, 10)] = cb.checked;
        });
        localStorage.setItem("attendance", JSON.stringify(attendance));
        navigateTo("finalAttendance");
        renderDashboard(currentUser.role); // refresh dashboard stats
    });

    /* ===================================================
       EVENTS — FILTER BUTTONS
    =================================================== */
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            eventFilter = btn.dataset.filter;
            renderEvents(eventFilter);
        });
    });

});

