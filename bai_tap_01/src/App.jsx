import "./App.css";

function App() {
  const student = {
    name: "Lê Công Hùng",
    mssv: "22110151",
    course: "Các công nghệ phần mềm mới",
    code: "MTSE431179",
  };

  return (
    <main className="root">
      <section className="info-card" aria-labelledby="student-name">
        <header className="card-header">
          <h1 id="student-name">{student.name}</h1>
          <p className="small muted">MSSV: {student.mssv}</p>
        </header>

        <div className="card-body">
          <div className="row">
            <span className="label">Môn:</span>
            <span className="value">
              {student.course} ({student.code})
            </span>
          </div>

          <div className="row">
            <span className="label">Ngày nộp: </span>
            <span className="value">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <footer className="card-footer">Bài tập buổi 1</footer>
      </section>
    </main>
  );
}

export default App;
