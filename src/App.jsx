import { useState } from 'react' // React-Hook für lokalen Komponentenstate
import { Routes, Route, Link } from 'react-router-dom' // Router-Komponenten für Navigation

export default function App() { // Hauptkomponente kapselt State und Routing
  const [tasks, setTasks] = useState([]) // Aufgabenliste bleibt im Speicher der App

  return ( // Rendert das App-Layout
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}> {/* Zentrierter Seitenrahmen */}
      <Header /> {/* Navigationsleiste anzeigen */}
      <Routes> {/* Definiert die verfügbaren Routen */}
        <Route path="/" element={<Landing />} /> {/* Landing-Seite als Startpunkt */}
        <Route // Route für die Kernfunktion
          path="/app" // URL-Pfad der App-Seite
          element={(
            <AppPage // Komponente für Formular und Liste
              tasks={tasks} // Überträgt aktuelle Aufgaben
              onAdd={(task) => setTasks((prev) => [...prev, task])} // Fügt neuen Task an
              onToggle={(id) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))} // Kippt erledigt-Status
              onDelete={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))} // Entfernt einen Task
            />
          )}
        />
        <Route path="/stats" element={<Stats tasks={tasks} />} /> {/* Stats-Seite mit Kennzahlen */}
        <Route path="*" element={<NotFound />} /> {/* Fallback für ungültige Routen */}
      </Routes>
    </div>
  )
}

function Header() { // Einfache Navigationsleiste
  return ( // Rendert Links zu den Unterseiten
    <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}> {/* Horizontale Linkliste */}
      <Link to="/">Landing</Link> {/* Link zur Landing-Seite */}
      <Link to="/app">App</Link> {/* Link zur App-Seite */}
      <Link to="/stats">Stats</Link> {/* Link zur Statistik-Seite */}
    </nav>
  )
}

function Landing() { // Landing-Ansicht erklärt den Zweck
  return ( // Rendert Textinhalte zur Einführung
    <section> {/* Semantischer Abschnitt */}
      <h1>StudySprint</h1> {/* Klare Überschrift */}
      <p>Minimaler Aufgabenplaner mit Timer-Fokus und einfacher Bedienung.</p> {/* Kurzbeschreibung */}
      <ul> {/* Liste der Kernpunkte */}
        <li>Aufgaben ohne Reload anlegen, abhaken und löschen.</li> {/* Highlight dynamischer Teil */}
        <li>Routing zwischen Landing, App und Stats.</li> {/* Hinweis auf Navigation */}
        <li>Kein Backend – alles bleibt lokal im Browser.</li> {/* Betonung der Vorgabe */}
      </ul>
      <p><Link to="/app">Jetzt starten</Link></p> {/* Call-to-Action zur App */}
    </section>
  )
}

function AppPage({ tasks, onAdd, onToggle, onDelete }) { // Kernseite mit Formular und Liste
  return ( // Kombiniert Formular und Liste
    <section> {/* Semantischer Abschnitt */}
      <h2>Aufgaben</h2> {/* Überschrift für den Arbeitsbereich */}
      <TaskForm onAdd={onAdd} /> {/* Formular zum Hinzufügen */}
      <TaskList tasks={tasks} onToggle={onToggle} onDelete={onDelete} /> {/* Liste der Aufgaben */}
    </section>
  )
}

function TaskForm({ onAdd }) { // Formular verwaltet Eingaben und Validierung
  const [title, setTitle] = useState('') // State für den Aufgabentitel
  const [minutes, setMinutes] = useState('25') // State für geschätzte Minuten
  const [errors, setErrors] = useState({}) // State für Fehlermeldungen

  const validate = () => { // Prüft die Eingabewerte
    const nextErrors = {} // Sammelt potenzielle Fehler
    if (!title.trim()) nextErrors.title = 'Titel ist erforderlich.' // Pflichtfeldprüfung für Titel
    const parsedMinutes = Number.parseInt(minutes, 10) // Parst Minuten als Ganzzahl
    if (Number.isNaN(parsedMinutes) || parsedMinutes < 1 || parsedMinutes > 200) { // Prüft Wertebereich
      nextErrors.minutes = 'Minuten 1–200 angeben.' // Fehlertext bei ungültigen Minuten
    }
    setErrors(nextErrors) // Speichert gefundene Fehler
    return Object.keys(nextErrors).length === 0 // true, wenn keine Fehler
  }

  const handleSubmit = (event) => { // Submit-Handler des Formulars
    event.preventDefault() // Verhindert Seitenneuladung
    if (!validate()) return // Bricht ab, falls Validierung scheitert
    onAdd({ // Meldet neue Aufgabe an den Parent
      id: crypto.randomUUID(), // Eindeutige ID im Browser erzeugen
      title: title.trim(), // Getrimmter Titel
      minutes: Number(minutes), // Numerische Minuten speichern
      done: false, // Startet immer als unerledigt
    })
    setTitle('') // Setzt das Titelfeld zurück
    setMinutes('25') // Setzt die Minuten zurück
  }

  return ( // Rendert das Formular
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 520 }}> {/* Grid-Layout für Inputs */}
      <label> {/* Label für den Titel */}
        Titel {/* Beschriftungstext */}
        <input // Eingabefeld für den Titel
          value={title} // Koppelt Wert an State
          onChange={(event) => setTitle(event.target.value)} // Aktualisiert Titel im State
          placeholder="z.B. Kapitel 3 zusammenfassen" // Hinweistext für Nutzer
        />
      </label>
      {errors.title && <small style={{ color: 'crimson' }}>{errors.title}</small>} {/* Fehlermeldung Titel */}

      <label> {/* Label für Minuten */}
        Minuten (1–200) {/* Beschriftungstext */}
        <input // Eingabefeld für Minuten
          type="number" // Sorgt für numerische Eingabe
          min={1} // Mindestwert 1 Minute
          max={200} // Höchstwert 200 Minuten
          step={1} // Schrittweite 1 Minute
          value={minutes} // Koppelt Wert an State
          onChange={(event) => setMinutes(event.target.value)} // Aktualisiert Minuten im State
        />
      </label>
      {errors.minutes && <small style={{ color: 'crimson' }}>{errors.minutes}</small>} {/* Fehlermeldung Minuten */}

      <button type="submit">Hinzufügen</button> {/* Sendet das Formular ab */}
    </form>
  )
}

function TaskList({ tasks, onToggle, onDelete }) { // Listet Aufgaben mit Aktionen
  if (tasks.length === 0) return <p>Keine Aufgaben angelegt.</p> // Leerzustand bei fehlenden Aufgaben

  return ( // Rendert eine Liste von Aufgaben
    <ul style={{ marginTop: 12 }}> {/* Ungeordnete Liste mit Abstand */}
      {tasks.map((task) => ( // Iteriert über alle Aufgaben
        <li // Listenelement für eine Aufgabe
          key={task.id} // Stabile Schlüssel für React
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }} // Flexlayout für Inhalte
        >
          <input // Checkbox zum Abhaken
            type="checkbox" // Checkboxtyp
            checked={task.done} // Kontrolliert durch done-Status
            onChange={() => onToggle(task.id)} // Meldet Statuswechsel
          />
          <span // Textbereich für Titel und Minuten
            style={{ textDecoration: task.done ? 'line-through' : 'none' }} // Durchstreichen bei erledigt
          >
            {task.title} – {task.minutes} min {/* Zeigt Titel und Dauer */}
          </span>
          <button onClick={() => onDelete(task.id)} aria-label="Aufgabe löschen">Löschen</button> {/* Löscht die Aufgabe */}
        </li>
      ))}
    </ul>
  )
}

function Stats({ tasks }) { // Einfache Statistikübersicht
  const total = tasks.length // Gesamtanzahl Aufgaben
  const done = tasks.filter((task) => task.done).length // Anzahl erledigter Aufgaben
  const minutes = tasks.reduce((sum, task) => sum + (task.done ? task.minutes : 0), 0) // Minuten erledigter Aufgaben

  return ( // Rendert Kennzahlen
    <section> {/* Semantischer Abschnitt */}
      <h2>Stats</h2> {/* Überschrift */}
      <p>Aufgaben gesamt: {total}</p> {/* Gesamtanzahl anzeigen */}
      <p>Erledigt: {done}</p> {/* Erledigte Aufgaben anzeigen */}
      <p>Erledigte Minuten: {minutes}</p> {/* Summe der erledigten Minuten */}
    </section>
  )
}

function NotFound() { // Fallback-Seite
  return <p>Seite nicht gefunden.</p> // Kurze Fehlermeldung
}
