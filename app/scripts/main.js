let DailyAyah = function() {
  let index = +localStorage.getItem('index') || 1
  let step  = +localStorage.getItem('step') || 1
  let day_data  = {}

  function init() {
    new_day() && increment() 
    day_data = data.ayat[index - 1]
    DailyAyah.tafseer = new Tafseer({name: 'sa3dy'})
    
    initView()
  }
  
  function initView() {
    $('.prev-ayah').click( () => change_ayah(-1) )
    $('.next-ayah').click( () => change_ayah(+1) )
    
    initAyahSelectors()
  }
  
  function initAyahSelectors() {
    let $select_surah = $('.select-surah')
    let $select_ayah = $('.select-ayah')
    
    initSuratOptions()
    $select_surah.change(initAyatOptions)
    
    function initSuratOptions() {
      $.each(data.surat, function() {
        $select_surah.append($('<option />').val(this.id).text(this.name_ar).data('count', this.count))
      });
    }
    
    function initAyatOptions() {
      let count = $select_surah.find('option:selected').data('count')
      
      $select_ayah.html('');
      for (let i=1; i<=count; i++) {
        $select_ayah.append($('<option />').val(i).text(i))
      }
    }
  }
  
  function new_day() {
    let last_access = new Date(localStorage.getItem('last-access'))
    let today = new Date()
    today.setHours(0,0,0,0)
    localStorage.setItem('last-access', today)
    return (last_access < today)
  }
  
  function increment(_step = step) {
    index += _step
    localStorage.setItem('index', index)
    return index
  }
      
  function change_ayah(_step) {
    increment(_step)
    day_data = data.ayat[index - 1]
    render()
  }
  
  //example "http://quran.ksu.edu.sa/index.php?l=ar#aya=1_1&m=hafs&qaree=husary&trans=ar_mu";
  function url_for(data, options) {
    return `http://quran.ksu.edu.sa/index.php?$aya=${data.sura}_${data.aya}`
  }
  
  let ornated_ayah_nbr = (nbr) => ` &#64831;${nbr}&#64830;`
  
  let safha_url = (safha) => `http://cdn.ksu.edu.sa/quran/ayat/safahat1/${safha}.png`
  
  function log() {
    let logs = {}
    logs.index = index
    logs.step = step
    logs.safha_url = safha_url(day_data.safha)
    logs.day_data = day_data
    logs.tafseer = DailyAyah.tafseer.getAyah(day_data.id)
    $('.debug').html(JSON.stringify(logs, null, 4))
  }
  
  
  function render() {
    $('.safha-img').attr( 'src' , safha_url(day_data.safha) )
    $('.ayah-txt').html(day_data.text)
    $('.ayah-nbr-decorated').html(ornated_ayah_nbr(day_data.aya))
    $('.ayah-nbr').html(`${data.surat[day_data.sura-1].name_ar}  - ${day_data.aya}`)
    $('.tafseer-text').html(DailyAyah.tafseer.getAyah(day_data.id))
    $('.tafseer-author').html(DailyAyah.tafseer.display_name)
  }
  
  class Tafseer {
    constructor (props) {
      this.name = props.name
      this.display_name = this.display_name(props.name)
    }
    
    display_name (name) {
      let display_names = {
        'sa3dy': 'السعدي'
      }
      return display_names[name]
    }
    
    getAyah (index) {
      if (this.name === 'sa3dy')
        return sa3dy[index-1].text
    }
    
  }
  
  init()
  render()
  log()
}

DailyAyah()
