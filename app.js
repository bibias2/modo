var chosen = { base: null, mid: null, top: null };

var baseShapes = {
  wide: '<ellipse cx="65" cy="28" rx="58" ry="18" fill="#DDEDE3" stroke="#6C6B6A" stroke-width="0.8"/>',
  oval: '<ellipse cx="65" cy="28" rx="46" ry="22" fill="#DDEDE3" stroke="#6C6B6A" stroke-width="0.8"/>',
  round: '<ellipse cx="65" cy="28" rx="36" ry="26" fill="#DDEDE3" stroke="#6C6B6A" stroke-width="0.8"/>',
  flat: '<ellipse cx="65" cy="32" rx="56" ry="11" fill="#DDEDE3" stroke="#6C6B6A" stroke-width="0.8"/>'
};
var midShapes = {
  smooth: '<ellipse cx="50" cy="24" rx="44" ry="22" fill="#F8F8F8" stroke="#6C6B6A" stroke-width="0.8"/>',
  river: '<ellipse cx="50" cy="24" rx="40" ry="20" fill="#F8F8F8" stroke="#6C6B6A" stroke-width="0.8"/><line x1="24" y1="20" x2="74" y2="25" stroke="#DDEDE3" stroke-width="1"/><line x1="20" y1="26" x2="70" y2="32" stroke="#DDEDE3" stroke-width="1"/>',
  porous: '<ellipse cx="50" cy="24" rx="36" ry="20" fill="#F8F8F8" stroke="#6C6B6A" stroke-width="0.8"/><circle cx="40" cy="21" r="2" fill="#DDEDE3"/><circle cx="52" cy="26" r="2" fill="#DDEDE3"/><circle cx="62" cy="19" r="1.5" fill="#DDEDE3"/>',
  dark: '<ellipse cx="50" cy="24" rx="38" ry="20" fill="#6C6B6A" stroke="#353533" stroke-width="0.8"/>'
};
var topShapes = {
  small: '<ellipse cx="40" cy="24" rx="24" ry="20" fill="#FFFDF8" stroke="#6C6B6A" stroke-width="0.8"/>',
  pointed: '<ellipse cx="40" cy="26" rx="20" ry="16" fill="#FFFDF8" stroke="#6C6B6A" stroke-width="0.8"/>',
  tiny: '<circle cx="40" cy="26" r="12" fill="#FFFDF8" stroke="#6C6B6A" stroke-width="0.8"/>',
  oblique: '<ellipse cx="42" cy="24" rx="22" ry="14" fill="#FFFDF8" stroke="#6C6B6A" stroke-width="0.8" transform="rotate(-10 42 24)"/>'
};

function select(el) {
  var layer = el.dataset.layer;
  document.querySelectorAll('[data-layer="' + layer + '"]').forEach(function(e) { e.classList.remove('active'); });
  el.classList.add('active');
  chosen[layer] = el.dataset.val;
  updatePreview();
  checkReady();
}

function updatePreview() {
  var base = document.getElementById('prev-base');
  var mid = document.getElementById('prev-mid');
  var top = document.getElementById('prev-top');
  var hint = document.getElementById('preview-hint');

  if (chosen.base) { base.innerHTML = baseShapes[chosen.base]; base.style.display = 'block'; }
  if (chosen.mid) { mid.innerHTML = midShapes[chosen.mid]; mid.style.display = 'block'; }
  if (chosen.top) { top.innerHTML = topShapes[chosen.top]; top.style.display = 'block'; }

  if (chosen.base && chosen.mid && chosen.top) hint.style.display = 'none';
}

function checkReady() {
  var btn = document.getElementById('send-btn');
  btn.disabled = !(chosen.base && chosen.mid && chosen.top);
}

function sendCard() {
  document.getElementById('send-btn').style.display = 'none';
  var confirm = document.getElementById('confirm-msg');
  confirm.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.stone-opt').forEach(function(el) {
    el.addEventListener('click', function() { select(this); });
  });

  document.getElementById('send-btn').addEventListener('click', sendCard);
});
