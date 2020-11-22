require(`dotenv`).config();

const fs = require(`fs`)
const Koa = require(`koa`);
const router = require(`@koa/router`)();

const app = new Koa();
app.listen(process.env.PORT);

router.get(`/list`, async (ctx) => {

  // if (!ctx.request.query.state) {
  //   ctx.status = 400;
  //   ctx.body = `Missing 'state' query parameter (can be 'on' or 'off')`;
  //   return;
  // }
  
  try {

    let dirents = fs.readdirSync(process.env.ROOT_DIR, {
      withFileTypes: true,
    });

    let files = dirents.filter(dirent => !dirent.isDirectory());

    let videos = files.map(file => {
      return {
        src: `${process.env.VIDEO_SERVER_ROOT}${file.name}`,
        preview: `${process.env.VIDEO_SERVER_ROOT}thumbnails/${file.name}`,
        poster: `${process.env.VIDEO_SERVER_ROOT}thumbnails/${file.name.split(`.`).slice(0, -1).join(`.`)}.png`,
        title: file.name.split(`.`).slice(0, -1).join(`.`),
      }
    })
    
    ctx.body = {
      videos
    };
    
  } catch (err) {
    console.error(`err:`, err);
    ctx.status = 500;
    ctx.body = `Error: ${err.message}`
  }
  
})

app.use(router.routes());

