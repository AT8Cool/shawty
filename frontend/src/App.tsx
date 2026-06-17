import { Check, Copy, Link2 } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import './App.css'

type ShortenResponse = {
  short_code: string
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000'

function App() {
  const [url, setUrl] = useState('')
  const [shortCode, setShortCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const shortUrl = useMemo(() => {
    return shortCode ? `${API_BASE_URL}/${shortCode}` : ''
  }, [shortCode])

  async function handleShorten(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      setError('Enter a URL first.')
      return
    }

    setIsLoading(true)
    setError('')
    setCopied(false)

    try {
      const response = await fetch(`${API_BASE_URL}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
      })

      if (!response.ok) {
        throw new Error('Shorten request failed')
      }

      const data = (await response.json()) as ShortenResponse

      if (!data.short_code) {
        throw new Error('Short code was missing from the response')
      }

      setShortCode(data.short_code)
    } catch {
      setShortCode('')
      setError('Could not create a short link. Check that the API is running.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopy() {
    if (!shortUrl) {
      return
    }

    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)

    window.setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <main className="app">
      <section className="shortener-shell" aria-labelledby="app-title">
        <div className="brand-mark" aria-hidden="true">
          <Link2 size={28} strokeWidth={2.4} />
        </div>
        <p className="eyebrow">Shawty</p>
        <h1 id="app-title">Short links, clean sharing.</h1>

        <form className="shorten-form" onSubmit={handleShorten}>
          <label htmlFor="original-url">Long URL</label>
          <div className="input-row">
            <input
              id="original-url"
              type="url"
              value={url}
              name="original_url"
              placeholder="https://example.com/very/long/link"
              onChange={(event) => setUrl(event.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              <Link2 size={18} aria-hidden="true" />
              {isLoading ? 'Shortening...' : 'Shorten'}
            </button>
          </div>
        </form>

        {error ? (
          <p className="status status-error" role="alert">
            {error}
          </p>
        ) : null}

        {shortUrl ? (
          <div className="result" aria-live="polite">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
            <button type="button" className="copy-button" onClick={handleCopy}>
              {copied ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <Copy size={18} aria-hidden="true" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default App
