# GO Mobility website

Cinematic responsive site built with Vinext and Sites. The page preserves the
supplied immersive scroll choreography while replacing the original concept
drawings with GO fleet references and Luanda-focused photographic scenes.

## Develop
npm install
npm run dev

## Validate
npx tsc --noEmit
npm run build

## Content status
The Luanda taxi, driver-charging, five Driver Journey scenes and proposed Xyami
GO Smart Hub scene are original AI-generated concept photography. The hub is
clearly presented as a future design concept, not an existing site or confirmed
Xyami partnership.
Vehicle assets are manufacturer reference images; vehicle availability,
service rollout and future markets are not claimed as current deployments.

The contact forms prepare an email in the visitor's mail application. They do
not submit or store enquiries. Connect an approved contact endpoint before a
public commercial launch.

## Asset provenance
- GO logo: user-provided Assets_images/GO_Logo_White_green_point.png.
- Hero, people-charging scene and hub: original generated concept assets.
- Qin L: https://www.byd.com/cn/dynasty-home/models/qin/26-qin-l-dm-i.html
- ATTO 3: https://www.byd.com/en/car/atto3
- EX5: https://www.geely.com/en/models/ex5
- EXEED RX shared exterior reference: https://www.exeedinternational.com/global/rx/
- Geographic outlines: world-atlas 2, Natural Earth public-domain data.

Motion uses GSAP and ScrollTrigger for pinned scenes, parallax, horizontal
journeys, the vehicle transition, the energy sequence and the interactive
globe. Reduced-motion preferences are respected. Browser interaction QA covers
the hero, fleet tabs, exterior/interior toggle and technical-information panel.
