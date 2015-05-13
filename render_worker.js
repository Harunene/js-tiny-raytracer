importScripts('math.js');
importScripts('object.js');
importScripts('util.js');


var SCREEN_HEIGHT;
var SCREEN_WIDTH;
var SCREEN_DISTANCE;
var REFLECTION_LEVEL;
var objects;
var offset;
var thread_count;
var pix;

function draw_inner(y)
{
  var delta = 30;

  for (var it = 0; it < delta && y <= SCREEN_HEIGHT/2; it++, y++)
  {
    var xy = 4*SCREEN_WIDTH*(y+SCREEN_HEIGHT/2) + offset*4;
    for (x = -SCREEN_WIDTH/2 + offset; x < SCREEN_WIDTH/2; x+=thread_count, xy+=4*thread_count)
    {
      tmpvec = new Vector(x, y, SCREEN_DISTANCE);
      tmpray = new Ray(eyepos, eyecoord.worldize(tmpvec));
      tmpcolor = getColor(tmpray, REFLECTION_LEVEL);
      pix[xy] = tmpcolor.x*255; pix[xy+1] = tmpcolor.y*255; pix[xy+2] = tmpcolor.z*255;
    }
  }

  if (y <= SCREEN_HEIGHT/2)
  {
    setTimeout(draw_inner, 1, y, thread_count);
  }
  else
  {
    close();
  }
  if (offset == 0)
  {
    refresh(y);
    hello.innerText += " " + ((new Date()).getTime() - startTick.getTime()) + "ms";
    clearInterval(refreshTimer);
  }
}

self.addEventListener('message', function(e) {
  e = JSON.parse(e.data.json, functionReviver);

  objects = e.objects;
  console.log(objects);
  offset = e.offset;
  SCREEN_HEIGHT = e.SCREEN_HEIGHT;
  SCREEN_WIDTH = e.SCREEN_WIDTH;
  SCREEN_DISTANCE = e.SCREEN_DISTANCE;
  REFLECTION_LEVEL = e.REFLECTION_LEVEL;
  thread_count = e.thread_count;
  eyecoord = deserialize(CoordinationSystem, e.eyecoord);
  eyepos = deserialize(Point, e.eyepos);
  
  draw_inner(-SCREEN_HEIGHT/2);
}, false);