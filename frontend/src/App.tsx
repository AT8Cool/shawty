import './App.css'
import {useState} from "react";


function App() {
  const [url, setUrl] = useState<string>("")
  const [shortCode, setShortCode] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false);

  async function handleShorten() {
    const response = await fetch(
      "http://127.0.0.1:8000/shorten",
      {
        method:"POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url:url
        })
      }
    );

    const data = await response.json();
    console.log(data);
    setShortCode(data.short_code);
    setCopied(false);

  }
  async function handleCopy(){
    const fullUrl =  `http://127.0.0.1:8000/${shortCode}`
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)

        setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <main className="app">
      <section className="shortener-shell" aria-labelledby="app-title">
        <p className="eyebrow">Shawty</p>
        <h1 id="app-title">Create short links for cleaner sharing.</h1>
        <p className="intro">
          A focused frontend shell is ready for the short-link workflow.
        </p>
        
        <input
         type="url"
         value = {url} 
         name='original_url' 
         placeholder='Enter your URL, Shawty'
        onChange={(e) => setUrl(e.target.value)}
         />
        <button onClick={handleShorten}>
          Shorten
        </button>
        {shortCode && (
          <p>
            Short URL:
            <a href= {`http://127.0.0.1:8000/${shortCode}`} 
            target="_blank"
            rel="noopener noreferrer">
               {`http://127.0.0.1:8000/${shortCode}`}
            </a>

          </p>
        )}
        {shortCode && (
            <button onClick={handleCopy}> Copy</button>
        )}
        
       
       { copied ? <p>Copied to clipboard</p>: "" }
        


      </section>
    </main>
      
  )
}


export default App
