
window.addEventListener('DOMContentLoaded', () => {
  let dropdown = document.getElementById("dropdown")
  let outer = document.getElementById("outer")
  outer.addEventListener('click', () => {
    dropdown.dataset.buttonState = 'true'
  })
  window.addEventListener('click', () => {
    dropdown.dataset.buttonState = 'false'
  }, true)
})
