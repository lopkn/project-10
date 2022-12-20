var abuttons = [
		{"color":"yellow",
		"x":5,"y":5,"w":25,"h":25,
		"clicked":()=>{
				interactor.maximized = false
				interactor.w = 35;
				interactor.h = 35;
				interactor.mainBoxInfo.color = "rgba(255,0,255,0.4)"
			}

		},
		{"color":"#00CFCF",
		"x":5,"y":35,"w":25,"h":25,
		"clicked":()=>{
				interactor.page += 1
				if(interactor.page > 2){
					interactor.page = 1
				}
				interactor.loadPageButtons()
			}

		},
		{"color":"#008F8F",
		"x":5,"y":65,"w":25,"h":25,
		"clicked":()=>{
				interactor.page -= 1
				if(interactor.page < 1){
					interactor.page = 2
				}
				interactor.loadPageButtons()
			}

		},
		{"color":"#8000FF",
		"x":5,"y":205,"w":30,"h":30,
		"clicked":()=>{
				interactor.phaseState = "movingCamVel"
			}

		},
		{"color":"#404040",
		"x":40,"y":205,"w":30,"h":30,
		"clicked":()=>{
				interactor.phaseState = "zooming"
			}

		},
		{"color":"#A00000",
		"x":45,"y":15,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[0] = "A"
			GI.type[1] = e
		}

		},
		{"color":"#A00000",
		"x":75,"y":15,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[0] = "B"
			GI.type[1] = e
		}

		},
		{"color":"#A00000",
		"x":105,"y":15,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[0] = "C"
			GI.type[1] = e
		}

		},
		{"color":"#A00000",
		"x":135,"y":15,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[0] = "D"
			GI.type[1] = e
		}

		},
		{"color":"#A00000",
		"x":165,"y":15,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[0] = "E"
			GI.type[1] = e
		}

		},
		{"color":"#A00000",
		"x":195,"y":15,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[0] = "F"
			GI.type[1] = e
		}

		},
		{"color":"#A00000",
		"x":225,"y":15,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[0] = "G"
			GI.type[1] = e
		}

		},
		{"color":"#A00000",
		"x":255,"y":15,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[0] = "H"
			GI.type[1] = e
		}

		},
		{"color":"#A00000",
		"x":285,"y":15,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[0] = "I"
			GI.type[1] = e
		}

		},
		{"color":"#A00000",
		"x":315,"y":15,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[0] = "J"
			GI.type[1] = e
		}

		},
		{"color":"#A00000",
		"x":45,"y":45,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[0] = "K"
			GI.type[1] = e
		}

		},
		{"color":"#A00000",
		"x":75,"y":45,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[0] = "L"
			GI.type[1] = e
		}

		},

		{"color":"#00F000",
		"x":80,"y":205,"w":30,"h":30,
		"clicked":()=>{
				if(GI.paused){
				interactor.abuttons[17].color = "#00F000"
				psf = ()=>{G.updateParticles()}
				} else {
					interactor.abuttons[17].color = "#FF0000"
					psf = ()=>{}
				}
				GI.paused = !GI.paused
			}

		},
		{"color":"#00B000",
		"x":115,"y":205,"w":30,"h":30,
		"clicked":()=>{
				interactor.phaseState = "timeDile"
			}

		},
		{"color":"#007000",
		"x":150,"y":205,"w":30,"h":30,
		"clicked":()=>{
				GI.FRATE = 50;
				clearInterval(_MainInterval_)
				_MainInterval_ = setInterval(()=>{repeat()},GI.FRATE)
			}

		},
		{"color":"#707000",
		"x":190,"y":205,"w":30,"h":30,
		"clicked":()=>{
				if(GI.functionals.shift){
				abuttons[20].color = "#707000"
				} else {
				abuttons[20].color = "#FF0000"
				}
				GI.functionals.shift = !GI.functionals.shift
			}

		},
		{"color":"#B0B000",
		"x":225,"y":205,"w":30,"h":30,
		"clicked":()=>{
				if(GI.functionals.ctrl){
				abuttons[21].color = "#B0B000"
				} else {
				abuttons[21].color = "#FF0000"
				}
				GI.functionals.ctrl = !GI.functionals.ctrl
			}

		},
		{"color":"#F0F000",
		"x":260,"y":205,"w":30,"h":30,
		"clicked":()=>{
				if(GI.functionals.alt){
				abuttons[22].color = "#F0F000"
				} else {
				abuttons[22].color = "#FF0000"
				}
				GI.functionals.alt = !GI.functionals.alt
			}

		},
		{"color":"#FF0000",
		"x":315,"y":205,"w":30,"h":30,
		"clicked":()=>{
				GI.particlesArr = []
				GI.particles = {}
			}

		},
		{"color":"#8000FF",
		"x":155,"y":100,"w":40,"h":40,
		"clicked":()=>{
				interactor.phaseState = "movingCam"
			}

		},

		{"color":"#A04000",
		"x":315,"y":45,"w":25,"h":25,
		"clicked":()=>{
				interactor.phaseState = "padPhase"
			},
		"up":(e)=>{
			GI.type[2] = e
		}

		},
		{"color":"#505050",
		"x":315,"y":75,"w":25,"h":25,
		"clicked":()=>{
			GI.grid = !GI.grid
			}

		},


	]