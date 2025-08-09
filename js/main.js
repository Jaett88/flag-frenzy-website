<script>
  // Active nav + year + mobile menu
  (function(){
    const path = location.pathname.replace(/\/index\.html$/,'/');
    document.querySelectorAll('.nav-link').forEach(a=>{
      const href=a.getAttribute('href');
      if ((href==='/index.html' && path==='/') || href===path) a.classList.add('active');
    });
    const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
    const btn=document.getElementById('menuBtn'), mob=document.getElementById('mobileNav');
    if(btn && mob){ btn.addEventListener('click',()=>mob.classList.toggle('hidden')); }
  )();
</script>
