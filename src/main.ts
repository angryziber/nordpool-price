import App from './App.svelte'
import {mount} from 'svelte'

addEventListener('error', function(e) {
  document.body.innerHTML += '<p style="color:red">' + e.error + '<br>at ' + e.filename + ':' + e.lineno + ':' + e.colno
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => console.log('Service Worker Registered'))
}

mount(App, {target: document.getElementById('app')})
