import("stdfaust.lib");
process = ba.pulsen(1, 5000) : pm.djembe(hslider("v:drum/freq",60, 0, 200, 0.1), 0.2, 0.4, hslider("v:drum/gain",0.6, 0, 1.2, 0.01)) <: dm.freeverb_demo;