let q = el => document.querySelector(el)
let qa = el => document.querySelectorAll(el)

/**
 * 
 * @param {0|1|2|3|4|5|6} beginWith 0:Sunday   1:Monday -> 6:Saturday
 * 
 */
function Calender(beginWith) {
  if (!(this instanceof Calender)) return
  this.els = {
    title: q("#title"),
    arrowLeft: q("#pre"),
    arrowRight: q("#next"),
    grid: q("#grid"),
    gridDays: q("#grid-days"),
    gridDaysWrapper: q('#grid-days-wrapper'),
    gridItems: qa(".grid-item"),
    gridItemsWeek: qa(".grid-item.week"),
    gridItemsDay: qa(".grid-item.day"),
  }
  this.date = {
    today: new Date(),
    thisMonth: 0,// 0 -> 11
    thisYear: 1,
    thisMonthDays: 0,
  }
  this.layout = {
    beginGrid: 0, // from 0
    FIRST_DAY_WEEK: Math.max(Math.min(beginWith, 6), 0)
  }
  this.init()
  this.bindEvents()
}

Calender.prototype.init = function () {
  // draw weeks
  // const WEEK = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"]
  const WEEK = ["日", "一", "二", "三", "四", "五", "六"]
  let begin = this.layout.FIRST_DAY_WEEK

  this.els.gridItemsWeek.forEach(el => {
    el.textContent = WEEK[begin++ % 7]
  })


  this.date.thisMonth = this.date.today.getMonth()
  this.date.thisYear = this.date.today.getFullYear()
  this.calcFromYearAndMonth()
  this.render(true)
}

Calender.prototype.calcFromYearAndMonth = function () {
  let day = new Date(this.date.thisYear, this.date.thisMonth)
  day.setDate(1)// first day of this month  
  let offset = day.getDay() - this.layout.FIRST_DAY_WEEK
  offset = (offset >= 0 ? offset : 7 + offset)
  this.layout.beginGrid = offset
  day.setMonth(this.date.thisMonth + 1) // next month
  day.setDate(0) // last day of this month
  this.date.thisMonthDays = day.getDate()
}

Calender.prototype.render = function (resize) {
  let gridItemWidth
  if (resize) {
    gridItemWidth = parseFloat(getComputedStyle(this.els.gridDays).width) / 7
    this.els.gridItems.forEach(e => e.style.width = `${gridItemWidth}px`)
  }
  let thisYear = this.date.thisYear
  let nowYear = this.date.today.getFullYear()
  let thisMonth = this.date.thisMonth
  let nowMonth = this.date.today.getMonth()
  let today = this.date.today.getDate()

  this.els.title.textContent = `${thisYear} 年 ${thisMonth + 1} 月`


  // calc which areas to rewrite number
  let beginGrid = this.layout.beginGrid
  let endGrid = beginGrid + this.date.thisMonthDays - 1

  let gridDaysWrapper = this.els.gridDaysWrapper
  let oldGridDays = this.els.gridDays
  let newGridDays = oldGridDays.cloneNode(true)
  console.log(newGridDays)
  for (let i = 0, date = 1, len = this.els.gridItemsDay.length; i < len; i++) {
    let vnode = newGridDays.children[i]// el
    vnode.textContent = ""
    if (i >= beginGrid && i <= endGrid) {// valid grid block
      vnode.textContent = date
      date++
    }
    if (thisYear === nowYear && thisMonth === nowMonth && date === today) vnode.classList.add("today")
    else vnode.classList.remove("today")
  }
  gridDaysWrapper.removeChild(oldGridDays)
  gridDaysWrapper.append(newGridDays)
  this.els.gridDays = newGridDays
}

Calender.prototype.bindEvents = function () {

  window.addEventListener("resize", () => { this.render(true) })
  this.els.arrowLeft.addEventListener("click", () => {
    if (this.date.thisMonth === 0) { //Jan
      this.date.thisYear--
      this.date.thisMonth = 11
      this.date.thisMonthDays = 31
    } else {
      let d = new Date(this.date.thisYear, this.date.thisMonth)
      d.setDate(0)
      this.date.thisMonthDays = d.getDate()
      this.date.thisMonth--
    }
    this.calcFromYearAndMonth()
    this.render()
  })
  this.els.arrowRight.addEventListener("click", () => {
    if (this.date.thisMonth === 11) { // Dec
      this.date.thisYear++
      this.date.thisMonth = 0
      this.date.thisMonthDays = 31
    } else {
      let d = new Date(this.date.thisYear, this.date.thisMonth + 2)
      d.setDate(0)
      this.date.thisMonthDays = d.getDate()
      this.date.thisMonth++
    }
    this.calcFromYearAndMonth()
    this.render()
  })
}

new Calender(0)


