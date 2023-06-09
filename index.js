var M_WIDTH=800, M_HEIGHT=450;
var app ={stage:{},renderer:{}}, game_res, objects={}, game_tick=0, LANG = 0,git_src,some_process = {}, game_platform='';
var my_data={opp_id : ''}, my_card, music;
const place_xpos=[0,160,320,480];

irnd = function (min,max) {	
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
	//inclusive
}

const rgb_to_hex = (r, g, b) => '0x' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};


		this.place=new PIXI.BitmapText("", {fontName: 'mfont',fontSize: 25});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25});
		this.name.tint=0xdddddd;
		this.name.x=105;
		this.name.y=22;


		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25});
		this.rating.x=298;
		this.rating.tint=rgb_to_hex(255,242,204);
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}

}

class player_card_class extends PIXI.Container{
		
	constructor(){
		
		super();
		
		this.place=0;
		
		this.bcg=new PIXI.Sprite(gres.pcard_bcg.texture);
		this.bcg.width=170;
		this.bcg.height=120;
						
		this.avatar_bcg=new PIXI.Sprite(gres.pcard_avatar_bcg.texture);
		this.avatar_bcg.width=80;
		this.avatar_bcg.height=80;
		this.avatar_bcg.x=10;
		this.avatar_bcg.y=10;
		this.avatar_bcg.anchor.set(0,0)
		
		this.frame=new PIXI.Sprite(gres.pcard_frame.texture);
		this.frame.width=80;
		this.frame.height=80;
		this.frame.x=10;
		this.frame.y=10;
		this.frame.anchor.set(0,0)			
		
		this.avatar=new PIXI.Sprite();
		this.avatar.width=60;
		this.avatar.height=60;		
		this.avatar.x=50;
		this.avatar.y=50;
		this.avatar.anchor.set(0.5,0.5);		
		
		this.life=3;

		
		this.cross_out=new PIXI.Sprite(gres.cross_out_img.texture);
		this.cross_out.width=170;
		this.cross_out.height=120;
		this.cross_out.visible=false;
				
		this.corner=new PIXI.Sprite(gres.pcard_corner.texture);
		this.corner.width=70;
		this.corner.height=70;
		
				
		this.place_t=new PIXI.Sprite(gres.num_pic1.texture);
		this.place_t.width=40;
		this.place_t.height=50;
		this.place_t.x=5;
		
		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 20});
		this.name.x=85
		this.name.y=95;
		this.name.anchor.set(0.5,0.5);
		this.name.tint=0xffffff;
		
		this.y=this.sy=-3;
		this.id=0;
		
		
		this.search_start_time=10;
		this.search_inc_time=1;
		
		this.next_find_time=0;
		this.me=false;
		
		this.found_points=0;
		
		this.process=function(){};
		
		this.points=[];
		for(let y=0;y<3;y++){	
			for (let x=0;x<4;x++){		
				

				const pnt=new PIXI.Sprite(gres.point.texture);
				pnt.width=25;
				pnt.height=25;
				pnt.x=82+x*17;
				pnt.y=y*15+15;				
				this.points.push(pnt);
			}			
		}
		
		
		//это жизни игрока
		this.lifes_markers=[];
		for (let x=0;x<4;x++){	
		
			const pnt=new PIXI.Sprite(gres.life_marker.texture);
			pnt.width=25;
			pnt.height=25;
			pnt.x=82+x*17;
			pnt.y=62;			
			pnt.visible=false;
			this.lifes_markers.push(pnt);
			
		}		
		
		
		
		this.addChild(this.bcg,this.avatar_bcg,this.avatar,this.frame,this.corner,this.place_t,this.name,...this.points,...this.lifes_markers,this.cross_out);
		
	}
	
	set_place(p){		
		this.place=p;
		this.place_t.texture=gres['num_pic'+p].texture;
	}
	
	reset(){		
		this.name.text='';		
		this.points.forEach(p=>p.visible=false);
		this.found_points=0;
		this.cross_out.visible=false;
	}
	
	make_zero(){		
		this.points.forEach(p=>p.visible=false);
		this.found_points=0;		
	}
	
	start_search(){
		
		this.next_find_time=game_tick+3+Math.random()*7;
		
	}
	
	set_pending(){
		
		this.avatar.texture=gres.search_circle_img.texture;
		this.process=this.process_pending;
		
	}
	
	transliterate(word){
		var a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"A","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
		return word.split('').map(function (char) { 
			return a[char] || char; 
		}).join("");
	}
	
	async set(fp_id){
		
		const snapshot = await firebase.database().ref("fp/"+fp_id).once('value');
		const fp_data = snapshot.val();
		const loader=new PIXI.Loader();
		loader.add('fp'+fp_id, fp_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});
		await new Promise(resolve=> loader.load(resolve));
				

		if (LANG===1) fp_data.name=this.transliterate(fp_data.name);
		
		make_text(this.name,fp_data.name,130);
		this.avatar.rotation=0;
		this.avatar.texture=loader.resources['fp'+fp_id].texture||PIXI.Texture.WHITE;
		this.process=function(){};
		
		this.search_start_time=7-(fp_id/8583)*6;
		this.search_inc_time=2-(fp_id/8583)*1.7;
		this.next_find_time=this.search_start_time;
		
	}
	
	init_life(life_bonus){
		
		this.lifes_markers[3].visible=false;
		
		this.life=3+life_bonus;
		for (let i=0;i<this.life;i++)
			this.lifes_markers[i].visible=true;
	}
	
	my_incorrect_event(){
		
		if(game.mode!=='online')
			return;
		
		if (this.life===0){			
			game.finish_event('no_life');
			return;
		}
		
		this.life--;
		this.lifes_markers[this.life].visible=false;
		
	}
	
	process_pending(){
		
		this.avatar.rotation+=0.1;
		
	}
	
	add_point(){
		
		this.points[this.found_points].visible=true;
		this.found_points++;		
		game.recalc_places();
		
	}
	
	process_searching(){
		if(this.visible===false)
			return;
		if(game_tick>this.next_find_time){
			

			this.add_point();			
			this.next_find_time=game_tick+this.search_start_time+this.search_inc_time*this.found_points;	
			this.next_find_time+=irnd(-5,5);
			
			//впадение в ступор
			if (Math.random()>0.8)
			this.next_find_time+=irnd(10,15);
			
			sound.play('opp_diff_found');
			console.log('fp added points')
		}
		
		
	}
	
	change_place(place){
		
		this.place_t.texture=gres['num_pic'+place].texture;
		this.place=place;
		anim2.add(this,{x:[this.x, place_xpos[place]]}, true, 0.25,'linear');			
		
	}
	
}

anim2={
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	empty_spr : {x:0,visible:false,ready:true, alpha:0},
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	any_on : function() {
		
		for (let s of this.slot)
			if (s !== null&&s.block)
				return true
		return false;		
	},
	
	wait(seconds){		
		return this.add(this.empty_spr,{x:[0,1]}, false, seconds,'linear');		
	},
	
	linear: function(x) {
		return x
	},
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutSine: function(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad: function(x) {
		return x * x;
	},
	
	easeOutBounce: function(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},
	
	easeInCubic: function(x) {
		return x * x * x;
	},
	
	ease2back : function(x) {
		return Math.sin(x*Math.PI*2);
	},
	
	easeInOutCubic: function(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	shake : function(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
		
		
	},	
	
	add : function(obj,params,vis_on_end,time,func,block) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);
		/*if (anim3_origin === undefined)
			anim3.kill_anim(obj);*/

		let f=0;
		//ищем свободный слот для анимации
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {

				obj.visible = true;
				obj.ready = false;
				
				//добавляем дельту к параметрам и устанавливаем начальное положение
				for (let key in params) {
					params[key][2]=params[key][1]-params[key][0];					
					obj[key]=params[key][0];
				}
				
				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back')
					for (let key in params)
						params[key][1]=params[key][0];					
					
				this.slot[i] = {
					obj: obj,
					block:block===undefined,
					params: params,
					vis_on_end: vis_on_end,
					func: this[func].bind(anim2),
					speed: 0.01818 / time,
					progress: 0
				};
				f = 1;
				break;
			}
		}
		
		if (f===0) {
			console.log("Кончились слоты анимации");	
			
			
			//сразу записываем конечные параметры анимации
			for (let key in params)				
				obj[key]=params[key][1];			
			obj.visible=vis_on_end;
			obj.alpha = 1;
			obj.ready=true;
			
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
		else {
			return new Promise(function(resolve, reject){					
			  anim2.slot[i].p_resolve = resolve;	  		  
			});			
			
		}

	},	
	
	process: function () {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				s.progress+=s.speed;		
				
				for (let key in s.params)				
					s.obj[key]=s.params[key][0]+s.params[key][2]*s.func(s.progress);		
				
				//если анимация завершилась то удаляем слот
				if (s.progress>=0.999) {
					for (let key in s.params)				
						s.obj[key]=s.params[key][1];
					
					s.obj.visible=s.vis_on_end;
					if (s.vis_on_end === false)
						s.obj.alpha = 1;
					
					s.obj.ready=true;					
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}			
		}
		
	}
	
}

sound = {
	
	on : 1,
	
	play : function(snd_res,res_source) {
				
		if(res_source===undefined)
			res_source=gres;
		
		if (this.on === 0)
			return;
		
		if (res_source[snd_res]===undefined)
			return;
		
		res_source[snd_res].sound.play();	
		
	},
	
	stop_all(){
		
		PIXI.sound.stopAll();
	}
}

make_text = function (obj, text, max_width) {

	let sum_v=0;
	let f_size=obj.fontSize;

	for (let i=0;i<text.length;i++) {

		let code_id=text.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];
			text = text.substring(0, i) + 'S' + text.substring(i + 1);
		}

		sum_v+=char_obj.xAdvance*f_size/64;
		if (sum_v>max_width) {
			obj.text =  text.substring(0,i-1);
			return;
		}
	}

	obj.text =  text;
}

game={
	
	dp:[],	
	found:0,
	mode:'online',
	active_players:[],
	bonus_dialog_resolver:null,
	bonuses:{life:false,hint:false,no:false},
		
	async activate() {
							

		this.mode='online';
			
		
		//короткое обращение к моей карточке
		my_card=objects.player_cards[3];
				
		//массив активных игроков
		this.active_players=[];
		for(let p=0;p<4;p++)
			this.active_players.push(objects.player_cards[p]);
		
		//устанавливаем мне проигрышный рейтингах
		firebase.database().ref('players/'+my_data.uid+'/rating').set(my_data.rating===0?0:(my_data.rating-1));
						
		this.replay();

	},
	
	async show_new_round_info(){
		
		await anim2.add(objects.new_round_info,{scale_xy:[3, 0.666]}, true, 0.5,'linear');	
		anim2.add(objects.new_round_info,{alpha:[1, 0],scale_xy:[0.666, 0.555]}, false, 3,'linear');	
	},
			
	play_finish_sound(result) {
		
		if (result === LOSE )
			sound.play('lose');
		if (result === WIN )
			sound.play('win');
		if (result === DRAW || result === NOSYNC)
			sound.play('draw');
		
	},
		
	close(){
		
		//останавливаем игру
		some_process.game=function(){};
		
		this.bonuses.life=false;
		this.bonuses.hint=false;
		
		//общие элементы для игры
		objects.player_cards[0].visible=false;
		objects.player_cards[1].visible=false;
		objects.player_cards[2].visible=false;
		objects.player_cards[3].visible=false;
		objects.time_bar.visible=false;
		objects.circles.forEach(c=>c.visible=false);
		objects.pic1cont.visible=false;
		objects.pic2cont.visible=false;
		objects.controls_cont.visible=false;
	},
		
	finish_event (event) {
				
		//останавливаем игру
		some_process.game=function(){};		
		
		//убираем кнопки чтобы никто не нажал
		anim2.add(objects.controls_cont,{y:[objects.controls_cont.y,-200]}, false, 0.5,'linear');	
		anim2.add(objects.time_bar,{width:[objects.time_bar.width+5,0]}, true, 0.5,'linear');
		
		const last_player=this.get_last_player();
		const is_fin_round=this.active_players.length===2;
		
		if (event==='no_life')
			this.process_my_out();
				
		if (event==='my_cancel')
			this.process_my_cancel();
				
		if (last_player!=='more_than_one_last' && !last_player.me && !is_fin_round && this.mode==='online'&& !event)
			this.process_my_win_round(last_player);
		
		if (last_player!=='more_than_one_last' && !last_player.me && is_fin_round && this.mode==='online'&& !event)
			this.process_my_win_game();
		
		if (last_player.me && this.mode==='online'&& !event)
			this.process_my_out();
		
		if (this.mode==='single'&& !event)
			this.process_my_win_single();
		
		this.mode='finished';
	},
	
	async process_my_win_round(last_player){
				
		console.log('process_my_win_round');	
		objects.dialog_no.visible=false;
		objects.dialog_ok.visible=false;
		sound.play('win_round');
		objects.dialog_notice.text=['Вы прошли в следующий раунд!','You have advanced to the next round!'][LANG];		
		objects.dialog_notice2.text=')))';
		
		
		
		
		await anim2.add(objects.dialog_cont,{scale_y:[0, 1]}, true, 0.25,'linear');	
		await anim2.wait(3);
		await anim2.add(objects.dialog_cont,{scale_y:[1, 0]}, false, 0.25,'linear');	

		//если картинки видны то сначала убираем их
		if (objects.pic1cont.visible){
			anim2.add(objects.pic1cont,{x:[objects.pic1cont.sx, objects.pic1cont.sx-500]}, false, 0.5,'linear');	
			await anim2.add(objects.pic2cont,{x:[objects.pic2cont.sx, objects.pic2cont.sx+500]}, false, 0.5,'linear');				
		}


		//удаляем из массива активных игроков
		this.active_players = this.active_players.filter(function(card) {return card.id !== last_player.id});
				
		
		for (let c of objects.circles){
			if (c.visible) {
				
				await anim2.wait(0.1);
				c.visible=false;
				sound.play('whoosh');
				
			}			
		}
				
				
		//показываем крест
		await anim2.add(last_player.cross_out,{alpha:[0, 1]}, true, 1,'linear');	
				
		//убираем с экрана
		await anim2.add(last_player,{y:[last_player.sy, last_player.sy-200]}, false, 1,'easeInBack');	
		
		this.replay();		
	},
	
	async process_my_win_game(){
		console.log('process_my_win_game');
		sound.play('applause');
		const old_rating=my_data.rating;
		my_data.rating++;
		firebase.database().ref('players/'+my_data.uid+'/rating').set(+my_data.rating);
		objects.dialog_notice.text=['Вы выиграли)))','You Win)))'][LANG];
		objects.dialog_notice2.text=['Рейтинг: ','Rating: '][LANG]+old_rating+' > '+(+my_data.rating);
		objects.dialog_no.visible=false;
		objects.dialog_ok.visible=true;		
		await anim2.add(objects.dialog_cont,{scale_y:[0, 1]}, true, 0.25,'linear');	
				
		await new Promise(resolve=>{			
			objects.dialog_ok.pointerdown=resolve;			
		})
		sound.play('click');

		game.close();
		main_menu.activate();			
		await anim2.add(objects.dialog_cont,{scale_y:[1, 0]}, false, 0.25,'linear');	

	},
	
	async process_my_win_single(){
		console.log('process_my_win_game');

		objects.dialog_notice.text=['Вы нашли все отличия, но не выиграли партию(((','You found all the differences, but did not win the game ((('][LANG];
		objects.dialog_notice2.text=')))';	
		objects.dialog_no.visible=false;
		objects.dialog_ok.visible=true;
		await anim2.add(objects.dialog_cont,{scale_y:[0, 1]}, true, 0.25,'linear');	
							
		await new Promise(resolve=>{			
			objects.dialog_ok.pointerdown=resolve;			
		})	
				
		game.close();
		await anim2.add(objects.dialog_cont,{scale_y:[1, 0]}, false, 0.25,'linear');			
		await this.show_bonus_dialog();
		main_menu.activate();			

	},
		
	async process_my_out(){
		console.log('process_my_out');
		sound.play('lose');

		//показываем крест
		await anim2.add(my_card.cross_out,{alpha:[0, 1]}, true, 1,'linear');	
				
		objects.dialog_notice.text=['Вы выбыли из игры(((\nПродолжить искать?','You are out of the game(((\nDo you want to continue searching?'][LANG];		
		
		objects.dialog_notice2.text=['Рейтинг: ','Rating: '][LANG]+my_data.rating+' > '+(my_data.rating===0?0:(+my_data.rating-1));
		if (my_data.rating>0) my_data.rating--;
		
		await anim2.add(objects.dialog_cont,{scale_y:[0, 1]}, true, 0.25,'linear');	
		
		objects.dialog_no.visible=true;
		objects.dialog_ok.visible=true;		
		objects.dialog_notice.visible=true;
		
		const res=await new Promise(resolver=>{			
			objects.dialog_no.pointerdown=function(){resolver('no')};			
			objects.dialog_ok.pointerdown=function(){resolver('ok')};	
		})	
		sound.play('click');
		await anim2.add(objects.dialog_cont,{scale_y:[1, 0]}, false, 0.25,'linear');	
		
		if(res==='no'){			
			game.close();
			main_menu.activate();			
			objects.dialog_cont.visible=false;
		}
		
		if(res==='ok'){			
			game.mode='single';			
			objects.time_bar.visible=false;
			objects.dialog_cont.visible=false;
			
			
			for (let p of this.active_players){
				if(!p.me){
					sound.play('whoosh');
					await anim2.add(p,{y:[p.sy, p.sy-200]}, false, 0.25,'easeInBack');	
					
				}
					
			}
			
			my_card.corner.visible=false;
			my_card.place_t.visible=false;
			
			anim2.add(my_card.cross_out,{alpha:[1, 0]}, false, 0.5,'linear');	
			sound.play('whoosh');
			
			await anim2.add(my_card,{x:[my_card.x, 0]}, true, 0.5,'linear');	
			anim2.add(objects.controls_cont,{y:[-200, objects.controls_cont.sy]}, true, 0.5,'linear');	
		}
						
	},
		
	async process_my_cancel(){

		sound.play('lose');

		//показываем крест
		await anim2.add(my_card.cross_out,{alpha:[0, 1]}, true, 1,'linear');	
				
		objects.dialog_notice.text=['Вы отменили игру!','You canceled the game!'][LANG];		
		
		objects.dialog_notice2.text=['Рейтинг: ','Rating: '][LANG]+my_data.rating+' > '+(my_data.rating===0?0:(my_data.rating-1));
		if (my_data.rating>0) my_data.rating--;	
		

		
		objects.dialog_no.visible=false;
		objects.dialog_ok.visible=true;		
		objects.dialog_notice.visible=true;
		
		await anim2.add(objects.dialog_cont,{scale_y:[0, 1]}, true, 0.25,'linear');			
		
		const res=await new Promise(resolver=>{			
			objects.dialog_ok.pointerdown=function(){resolver('ok')};	
		})	
		sound.play('click');
		await anim2.add(objects.dialog_cont,{scale_y:[1, 0]}, false, 0.25,'linear');	
		
		
		game.close();
		main_menu.activate();			
		objects.dialog_cont.visible=false;

		
						
	},
				
	async replay(){
		
		objects.circles.forEach(c=>c.visible=false);
		
		//если картинки видны то сначала убираем их
		if (objects.pic1cont.visible){
			anim2.add(objects.pic1cont,{x:[objects.pic1cont.sx, objects.pic1cont.sx-500]}, false, 0.5,'linear');	
			await anim2.add(objects.pic2cont,{x:[objects.pic2cont.sx, objects.pic2cont.sx+500]}, false, 0.5,'linear');				
		}

		anim2.add(objects.loading_header,{alpha:[0, 1]}, true, 0.25,'linear');
				
		some_process.loading_anim=function(){			
			objects.loading_header.scale_x=0.666+Math.sin(game_tick*5)*0.1;
		}
				
		my_card.init_life(this.bonuses.life);
				
		//загружаем картинки
		const loader=new PIXI.Loader();
		pic_id=irnd(1,102);
		//pic_id=36;
		console.log('PIC_ID: ',pic_id)
		loader.add('pic1',`pics/${pic_id}/pic1.png`);
		loader.add('pic2',`pics/${pic_id}/pic2.png`);
		loader.add('dp',`pics/${pic_id}/dp.txt`);		
		await new Promise(resolve=> loader.load(resolve))
		
	
		
		this.mode='online';
		objects.pic1.texture=loader.resources.pic1.texture;
		objects.pic2.texture=loader.resources.pic2.texture;
		const dp_data=JSON.parse(loader.resources.dp.data);
		this.dp=dp_data[0];
		
		
		objects.diff_num.text=['Найди '+this.dp.length+' отличий','Find '+this.dp.length+' differences',][LANG];		
		await anim2.add(objects.diff_num,{alpha:[0, 1]}, true, 0.5,'linear');
		await anim2.wait(1);
		anim2.add(objects.diff_num,{alpha:[1, 0]}, false, 0.5,'linear');
		
		
		console.log('DP_LENGH: ',this.dp.length);
		console.log(dp_data[1],dp_data[2]);
			
		anim2.add(objects.loading_header,{alpha:[1, 0]}, false, 0.25,'linear');
		some_process.loading_anim=function(){};
		
		//показываем надпись раунд
		if (this.active_players.length===2)
			objects.new_round_info.texture=gres.round_fin.texture;
		if (this.active_players.length===3)
			objects.new_round_info.texture=gres.round2.texture;
		if (this.active_players.length===4)
			objects.new_round_info.texture=gres.round1.texture;
		
		
		await anim2.add(objects.new_round_info,{scale_xy:[3, 0.666],alpha:[0.5,1],rotation:[0.5,0]}, true, 0.5,'linear');
		sound.play('round_start');
		await anim2.wait(1);
		await anim2.add(objects.new_round_info,{scale_xy:[0.666, 5],alpha:[1,0],rotation:[0,-0.5]}, true, 0.5,'linear');	
		
		
		
		
		//кнопки с подсказками
		if(this.bonuses.hint)
			objects.hint_button.visible=true
		else
			objects.hint_button.visible=false
		
		anim2.add(objects.controls_cont,{y:[-200, objects.controls_cont.sy]}, true, 0.5,'linear');	
		
		
		sound.play('slide');
		anim2.add(objects.pic1cont,{x:[objects.pic1cont.sx-500, objects.pic1cont.sx]}, true, 0.5,'linear');	
		await anim2.add(objects.pic2cont,{x:[objects.pic2cont.sx+500, objects.pic2cont.sx]}, true, 0.5,'linear');	
		
		for (let player of this.active_players){			
			player.make_zero();
			player.start_search();
		}
		
		
		
		objects.pic1.interactive=true;
		objects.pic2.interactive=true;
		
		objects.pic1.pointerdown=this.tap;
		objects.pic2.pointerdown=this.tap;
				
		//обнуляем найденые точки
		this.dp.forEach(p=>p[2]=0);
	
		this.found=0;
		
		some_process.game=this.process.bind(this);
		objects.time_bar.visible=true;
		objects.time_bar.scale_x=1;
		this.start_time=Date.now();
		
	},
	
	async bonus_card_down(card_id){
				
		if(anim2.any_on()){
			sound.play('locked');
			return;			
		}
		
		
		this.bonus_dialog_resolver(card_id);
		
	},
	
	async show_bonus_dialog(){
		
		objects.bonus0.visible=false;
		objects.bonus1.visible=false;
		objects.bonus2.visible=false;
		objects.bonus_card0.visible=false;
		objects.bonus_card1.visible=false;
		objects.bonus_card2.visible=false;			
		
		objects.bonus_card0.y=objects.bonus_card0.sy;
		objects.bonus_card1.y=objects.bonus_card1.sy;
		objects.bonus_card2.y=objects.bonus_card2.sy;	
		
		await anim2.add(objects.bonus_cont,{y:[900,objects.bonus_cont.sy]}, true, 0.5,'linear');	

		
		sound.play('whoosh2');
		await anim2.add(objects.bonus_card0,{x:[-100, objects.bonus_card0.sx],rotation:[-0.2,0]},true,0.25,'linear');	
		sound.play('whoosh2');
		await anim2.add(objects.bonus_card1,{x:[-100, objects.bonus_card1.sx],rotation:[-0.2,0]},true,0.25,'linear');	
		sound.play('whoosh2');
		await anim2.add(objects.bonus_card2,{x:[-100, objects.bonus_card2.sx],rotation:[-0.2,0]},true,0.25,'linear');	
		
		objects.bonus0.visible=true;
		objects.bonus1.visible=true;
		objects.bonus2.visible=true;
		
		//создаем бонусы и перемешиваем их
		let bonuses=[
			{rnd:Math.random(),bonus:'life',tex:gres.bonus_life.texture,prompt:'Вы выиграли дополнительную жизнь!'},
			{rnd:Math.random(),bonus:'hint',tex:gres.bonus_hint.texture,prompt:'Вы выиграли подсказку!'},
			{rnd:Math.random(),bonus:'no',tex:gres.no_bonus.texture,prompt:'Вы ничего не выиграли((('}
		];
		bonuses=bonuses.sort((a, b) => a.rnd - b.rnd);
				
		objects.bonus0.texture=bonuses[0].tex;
		objects.bonus1.texture=bonuses[1].tex;
		objects.bonus2.texture=bonuses[2].tex;
		
		
		const card_id=await new Promise(resolver=>{
			game.bonus_dialog_resolver=resolver;				
		})
		
		if (bonuses[card_id].bonus==='no')
			sound.play('bad_bonus');
		else
			sound.play('good_bonus');	

		objects.bonus_prompt.text=bonuses[card_id].prompt;
		
		//записываем бонус в актив
		this.bonuses[bonuses[card_id].bonus]=true;
		
		if (card_id===0){			
			anim2.add(objects.bonus0,{scale_xy:[0.6666, 1]}, true, 1,'easeOutBack');	
			sound.play('whoosh2');
			await anim2.add(objects.bonus_card0,{y:[objects.bonus_card0.y, 900]}, false, 1,'linear');sound.play('whoosh2');
			await anim2.add(objects.bonus_card1,{y:[objects.bonus_card1.y, 900]}, false, 0.5,'linear');	sound.play('whoosh2');
			await anim2.add(objects.bonus_card2,{y:[objects.bonus_card2.y, 900]}, false, 0.5,'linear');
		}
		
		if (card_id===1){		
			anim2.add(objects.bonus1,{scale_xy:[0.6666, 1]}, true, 1,'easeOutBack');	
			sound.play('whoosh2');
			await anim2.add(objects.bonus_card1,{y:[objects.bonus_card1.y, 900]}, false, 1,'linear');sound.play('whoosh2');	
			await anim2.add(objects.bonus_card0,{y:[objects.bonus_card0.y, 900]}, false, 0.5,'linear');	sound.play('whoosh2');
			await anim2.add(objects.bonus_card2,{y:[objects.bonus_card2.y, 900]}, false, 0.5,'linear');
		}
		
		if (card_id===2){			
			anim2.add(objects.bonus2,{scale_xy:[0.6666, 1]}, true, 1,'easeOutBack');		
			sound.play('whoosh2');
			await anim2.add(objects.bonus_card2,{y:[objects.bonus_card2.y, 900]}, false, 1,'linear');	sound.play('whoosh2');
			await anim2.add(objects.bonus_card1,{y:[objects.bonus_card1.y, 900]}, false, 0.5,'linear');	sound.play('whoosh2');
			await anim2.add(objects.bonus_card0,{y:[objects.bonus_card0.y, 900]}, false, 0.5,'linear');
			
		}
		
		anim2.add(objects.bonus_cont,{y:[objects.bonus_cont.y, 900]}, false, 0.5,'linear');	
		
	},
	
	resume_single_mode(){
		
		this.mode='single';
		
		
	},
		
	get_last_player(){
				
		//это если только один игрок
		if(this.active_players.length===1)
			return 'single';
		
		//определяем какой игрок на последнем месте
		let last_player={place:-1};
		this.active_players.forEach(player=>{
			if(player.place>last_player.place)
				last_player=player
		})
		
		return last_player;
		
	},
	
	async remove_last_player(last_player){
		
		//удаляем из массива активных игроков
		this.active_players = this.active_players.filter(function(card) {return card.id !== last_player.id});
				
		//показываем крест
		await anim2.add(last_player.cross_out,{alpha:[0, 1]}, true, 0.5,'linear');	
				
		//убираем с экрана
		await anim2.add(last_player,{y:[last_player.sy, last_player.sy-200]}, false, 0.5,'easeInBack');	

	},
	
	sound_button_down(){		
		
		
		this.on=!this.on;
		if(this.on){			
			objects.sound_button_off.visible=false;
			sound.on=1;
			sound.play('click');
		}else{
			objects.sound_button_off.visible=true;
			sound.on=0;
		}		
		
	},
	
	music_button_down(){
		
		
		music.on=!music.on;
		if(music.on){			
			objects.music_button_off.visible=false;
			music.resume();
		}else{
			objects.music_button_off.visible=true;
			music.pause();
		}
		sound.play('click');
	},
	
	async hint_button_down(){
		
		if(anim2.any_on()){
			sound.play('locked');
			return;			
		}
		
		sound.play('click');
		objects.hint_button.visible=false;
		this.bonuses.hint=false;
		
		let tarx=0, tary=0;
		for (let dp of this.dp){
			if (dp[2]===0){				
				tarx=objects.pic1.x+objects.pic1cont.x+dp[0];
				tary=objects.pic1.y+objects.pic1cont.y+dp[1];
				break;
			}		
		}
		
		await anim2.add(objects.hint_pointer,{x:[tarx-400, tarx],y:[tary-400,tary]},true,1,'linear');	
		sound.play('hint');
		await anim2.add(objects.hint_pointer,{alpha:[1, 0]},false,2,'linear');	


		
	},
	
	close_button_down(){
		
		
		if(anim2.any_on()){
			sound.play('locked');
			return;			
		}
		
		sound.play('click');
		this.finish_event('my_cancel');
		
	},
	
	exit(){
		
		this.close();
		main_menu.activate();
		
	},
	
	place_found_diff(dp){
			
		
		
		dp[2]=1;
		objects.circles[game.found].x=dp[0]+objects.pic1.x+objects.pic1cont.x;
		objects.circles[game.found].y=dp[1]+objects.pic1.y+objects.pic1cont.y;
		objects.circles[game.found].width=35;
		objects.circles[game.found].height=35;
		anim2.add(objects.circles[game.found],{alpha:[0, 1]}, true, 0.5,'linear');	
		
		game.found++;
		
		objects.circles[game.found].x=dp[0]+objects.pic2.x+objects.pic2cont.x;
		objects.circles[game.found].y=dp[1]+objects.pic2.y+objects.pic2cont.y;
		objects.circles[game.found].width=35;
		objects.circles[game.found].height=35;
		anim2.add(objects.circles[game.found],{alpha:[0, 1]}, true, 0.5,'linear');	
		
		game.found++;
		
	},
		
	recalc_places(){
		
		//проверяем завершение одиночной игры
		if(this.mode==='single'){			
			if(my_card.found_points===this.dp.length)
				this.finish_event();
			return;
		}
				
		//сортируем по найденым очкам (по убывания очков)
		this.active_players=this.active_players.sort((a,b) =>  b.found_points - a.found_points)
				
		let finish_flag=false;
		
		
		for(let i=0;i<this.active_players.length;i++){
			
			const player=this.active_players[i];
			
			if (player.place!==i){				
				player.change_place(i);					
				sound.play('whoosh');
			}

			
			if(player.found_points===this.dp.length)
				finish_flag=true;
		}
		
		if (finish_flag===true)
			this.finish_event();	
			
	},
	
	process(){		
		
		objects.player_cards[0].process_searching();
		objects.player_cards[1].process_searching();
		objects.player_cards[2].process_searching();
		
		const cur_time=Date.now();
		const time_passed=cur_time-this.start_time;
		const pers_passed=(1-time_passed/120000);
		objects.time_bar.width=objects.time_bar.base_width*(1-time_passed/120000)
				
		if (pers_passed<=0){					
			this.finish_event();
		}

		
	},
	
	async tap(e){
		
		
		if (game.mode==='finished')
			return
		
		let mx = e.data.global.x/app.stage.scale.x - this.x-this.parent.x;
		let my = e.data.global.y/app.stage.scale.y - this.y-this.parent.y;
		let any_found=false;
		for (let i=0;i<game.dp.length;i++){
			
			const dp=game.dp[i];
			const dx=dp[0]-mx;
			const dy=dp[1]-my;
			const d=Math.sqrt(dx*dx+dy*dy);
			
			if (d<15 && dp[2]===0) {				
				game.place_found_diff(dp);
				objects.player_cards[3].add_point();
				sound.play('my_diff_found');
				any_found=true;
			}
			
		}
		
		if(any_found===false){
			sound.play('locked2');
			my_card.my_incorrect_event();
			objects.wrong.width=45;
			objects.wrong.height=45;
			objects.wrong.x=mx+this.x+this.parent.x;
			objects.wrong.y=my+this.y+this.parent.y;			
			anim2.add(objects.wrong,{alpha:[1, 0]}, false, 1,'linear');	
		}
		
	}

}

keep_alive= function() {

	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);

}

req_dialog = {
	
	_opp_data : {} ,
	
	show(uid) {		
	
	
		if (state === 'b' && no_invite) {
			
			firebase.database().ref("inbox/"+uid).set({sender:my_data.uid,message:"REJECT_ALL",tm:Date.now()});
			return;
		}
	
		firebase.database().ref("players/"+uid).once('value').then((snapshot) => {

			//не показываем диалог если мы в игре
			if (state === 'p')
				return;

			player_data=snapshot.val();

			//показываем окно запроса только если получили данные с файербейс
			if (player_data===null) {
				//console.log("Не получилось загрузить данные о сопернике");
			}	else	{

				//так как успешно получили данные о сопернике то показываем окно
				sound.play('receive_sticker');
				anim2.add(objects.req_cont,{y:[-200, objects.req_cont.sy]},true,0.5,'easeOutElastic');

				//Отображаем  имя и фамилию в окне приглашения
				req_dialog._opp_data.name = player_data.name;
				make_text(objects.req_name,player_data.name,200);
				objects.req_rating.text = player_data.rating;
				req_dialog._opp_data.rating = player_data.rating;

				//throw "cut_string erroor";
				req_dialog._opp_data.uid=uid;
				
				//загружаем фото
				this.load_photo(player_data.pic_url);

			}
		});
	},

	load_photo: function(pic_url) {


		//сначала смотрим на загруженные аватарки в кэше
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

			//console.log("Загружаем текстуру "+objects.mini_cards[id].name)
			var loader = new PIXI.Loader();
			loader.add("inv_avatar", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
			loader.load((loader, resources) => {
				objects.req_avatar.texture=loader.resources.inv_avatar.texture;
			});
		}
		else
		{
			//загружаем текустуру из кэша
			//console.log("Ставим из кэша "+objects.mini_cards[id].name)
			objects.req_avatar.texture=PIXI.utils.TextureCache[pic_url];
		}

	},

	reject: function() {

		if (objects.req_cont.ready===false){
			sound.play('locked')
			return;				
		}
		
		sound.play('click');
		
		anim2.add(objects.req_cont,{y:[objects.req_cont.y, -260]},false,0.4,'easeInBack');
		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},
	
	reject_all_game: function() {

		if (objects.req_cont.ready===false){
			sound.play('locked')
			return;				
		}
	
		message.add(['Приглашения отключены','Invitations are disabled'][LANG]);
		no_invite = true;
		
		sound.play('click');
		
		anim2.add(objects.req_cont,{y:[objects.req_cont.y, -260]},false,0.4,'easeInBack');
		
		//удаляем из комнаты
		firebase.database().ref(room_name + "/" + my_data.uid).remove();
		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT_ALL",tm:Date.now()});
	},

	accept: function() {

		if (anim2.any_on()===true || objects.big_message_cont.visible === true || objects.feedback_cont.visible === true) {
			sound.play('locked');
			return;			
		}

		
		//устанавливаем окончательные данные оппонента
		opp_data=req_dialog._opp_data;


		anim2.add(objects.req_cont,{y:[objects.req_cont.y, -260]},false,0.4,'easeInBack');

		//отправляем информацию о согласии играть с идентификатором игры
		pic_id=0;
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),pic_id:pic_id});

		//заполняем карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		cards_menu.close();
		online_player.activate("slave",pic_id);

	},

	hide: function() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;

		anim2.add(objects.req_cont,{y:[objects.req_cont.y, -260]},false,0.4,'easeInBack');
	}

}

ad = {
	
	prv_show : -9999,
	
	show : function() {
		
		if ((Date.now() - this.prv_show) < 90000 )
			return false;
		this.prv_show = Date.now();		
		
		if (game_platform==="YANDEX") {			
			//показываем рекламу
			window.ysdk.adv.showFullscreenAdv({
			  callbacks: {
				onClose: function() {}, 
				onError: function() {}
						}
			})
		}
		
		if (game_platform==="VK") {
					 
			vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"})
			.then(data => console.log(data.result))
			.catch(error => console.log(error));	
		}		

		if (game_platform==="MY_GAMES") {
					 
			my_games_api.showAds({interstitial:true});
		}			
		
		if (game_platform==='GOOGLE_PLAY') {
			if (typeof Android !== 'undefined') {
				Android.showAdFromJs();
			}			
		}
		
		
	},
	
	show2 : async function() {
		
		
		if (game_platform ==="YANDEX") {
			
			let res = await new Promise(function(resolve, reject){				
				window.ysdk.adv.showRewardedVideo({
						callbacks: {
						  onOpen: () => {},
						  onRewarded: () => {resolve('ok')},
						  onClose: () => {resolve('err')}, 
						  onError: (e) => {resolve('err')}
					}
				})
			
			})
			return res;
		}
		
		if (game_platform === "VK") {	

			let res = '';
			try {
				res = await vkBridge.send("VKWebAppShowNativeAds", { ad_format: "reward" })
			}
			catch(error) {
				res ='err';
			}
			
			return res;				
			
		}	
		
		return 'err';
		
	}
}

search_menu={
	
	activate(){
		
		//let videoBaseTexture = PIXI.VideoBaseTexture.fromVideo(gres.search_video.data)
		objects.search_cont.visible=true;
		
		anim2.add(objects.search_header,{y:[500, objects.search_header.sy]}, true, 1,'linear');
		
		for(let p=0;p<4;p++){
			objects.player_cards[p].set_place(p);
			objects.player_cards[p].x=place_xpos[p];
			objects.player_cards[p].y=objects.player_cards[p].sy;	
			objects.player_cards[p].reset();	
			objects.player_cards[p].me=p===3;
		}
		
		//короткое глобальное обращение к моей карточке
		my_card=objects.player_cards[3];		
		
		make_text(my_card.name,my_data.name,150);
		my_card.avatar.texture=objects.id_avatar.texture;

		some_process.search_menu=this.process;
		some_process.search_menu=this.process.bind(this);
		objects.player_cards[0].set_pending();
		objects.player_cards[1].set_pending();
		objects.player_cards[2].set_pending();
		

		
		//показываем так как могли это удалить при одиночной игре
		my_card.corner.visible=true;
		my_card.place_t.visible=true;		
		
		objects.player_cards[0].visible=true;
		objects.player_cards[1].visible=true;
		objects.player_cards[2].visible=true;
		objects.player_cards[3].visible=true;
		
		//подсвечиваем мою карточку
		my_card.bcg.tint=0xff5555;
		
		this.load_photos();
	},
	
	get_unique_valus(N,min_inc,max_inc){
		
		let uset = new Set();
		while (uset.size < N) {
			const rint = Math.floor(Math.random() * (max_inc - min_inc + 1)) + min_inc;
			uset.add(rint);
		}
		return Array.from(uset);		
	},
	
	async load_photos(){
		
		
		gres.search_video.data.loop=true;
		gres.search_video.data.play();
		
		
		let texture = PIXI.Texture.from(gres.search_video.data);
		objects.search_video.texture=texture;
		
		//получаем троих игроков
		let min_player=my_data.rating*42;
		let max_player=my_data.rating*42+500;
		
		
		
		if (min_player>8000){
			min_player=8000;
			max_player=8583;
		} 
		
		if (min_player<=0){
			min_player=0;
			max_player=500;
		} 
		
		
		const fp_ids=this.get_unique_valus(3,min_player,max_player);
		
				
		let fp_names={};
		let loader=new PIXI.Loader();
		
		//загружаем фотки
		await new Promise((resolve, reject) => setTimeout(resolve, irnd(1000,3000)));
		await objects.player_cards[0].set(fp_ids[0])
		sound.play('player_found');
		await new Promise((resolve, reject) => setTimeout(resolve, irnd(1000,3000)));
		await objects.player_cards[1].set(fp_ids[1])
		sound.play('player_found');
		await new Promise((resolve, reject) => setTimeout(resolve, irnd(1000,3000)));
		await objects.player_cards[2].set(fp_ids[2])
		sound.play('player_found');
		await new Promise((resolve, reject) => setTimeout(resolve, irnd(1000,3000)));
		
		gres.search_video.data.pause();
		this.close();
		
	},
	
	close(){
		objects.search_cont.visible=false;
		some_process.search_menu=function(){};	
		game.activate();
	},
	
	process(){		
		objects.player_cards[0].process();
		objects.player_cards[1].process();
		objects.player_cards[2].process();
		
		if (objects.search_header.ready)
			anim2.add(objects.search_header,{scale_x:[0.666, 0.7]}, true, 1,'ease2back',false);
	}
	
}

main_menu={
	
	async activate(){
		
		if (music.isPlaying===false&&music.on) music.play();
		
		if (gres.music.isPlay)
		sound.play('music');
	
		sound.play('whoosh')
		await anim2.add(objects.header_title,{y:[-100, objects.header_title.sy],scale_x:[0.3,0.666]}, true, 0.5,'easeOutBounce',false);
		sound.play('whoosh')
		await anim2.add(objects.header_title2,{x:[1000, objects.header_title2.sx]}, true, 0.35,'linear',false);
		sound.play('whoosh')
		await anim2.add(objects.header_cards,{x:[-200, objects.header_cards.sx]}, true, 0.5,'easeOutBack',false);
		
		sound.play('note6')
		anim2.add(objects.header_online,{scale_xy:[0, 0.666]}, true, 0.25,'easeOutBack',false);
		
		
		anim2.add(objects.header_loup,{y:[-500, objects.header_loup.sy]}, true, 1,'linear',false);
		
		sound.play('note5');
		await anim2.add(objects.play_button,{y:[900, objects.play_button.sy]}, true, 0.25,'easeOutBack');
		sound.play('note5');
		await anim2.add(objects.lb_button,{y:[900, objects.lb_button.sy]}, true, 0.25,'easeOutBack');
		sound.play('note5');
		await anim2.add(objects.rules_button,{y:[900, objects.rules_button.sy]}, true, 0.25,'easeOutBack');
		
		some_process.main_menu=this.process;
	},
	
	process(){
		
		objects.header_loup.x=objects.header_loup.sx+40*Math.sin(game_tick*3);
		objects.header_loup.y=objects.header_loup.sy+40*Math.cos(game_tick*3);
		
		if (objects.header_title2.ready)
			anim2.add(objects.header_title2,{scale_x:[0.666, 0.7]}, true, 1,'ease2back',false);
		
		
	},
	
	play_button_down(){
		
		if(anim2.any_on())return;
		sound.play('click');
		this.close();
		search_menu.activate(irnd(0,19));
		
	},
	
	rules_button_down(){
		if(anim2.any_on())return;
		anim2.add(objects.rules,{alpha:[0, 1]},true,0.5,'linear');	
		
	},
	
	rules_ok_down(){
		if(anim2.any_on())return;
		anim2.add(objects.rules,{alpha:[1, 0]},false,0.5,'linear');	
	},
	
	lb_down(){
		
		if(anim2.any_on()){
			sound.play('locked');
			return;
		}
		this.close();
		lb.show();		
		
	},
		
	close(){
		
		anim2.add(objects.header_title,{y:[ objects.header_title.y,-100]}, false, 0.5,'linear',false);
		anim2.add(objects.header_title2,{x:[objects.header_title2.x,1000]}, false, 0.5,'linear',false);
		anim2.add(objects.header_cards,{x:[objects.header_cards.x,-200]}, false, 0.5,'linear',false);
		anim2.add(objects.header_online,{scale_xy:[objects.header_online.scale_xy,0.05]}, false, 0.5,'linear',false);
		anim2.add(objects.header_loup,{y:[ objects.header_loup.y,-500]}, false, 0.5,'linear',false);
		
		anim2.add(objects.play_button,{y:[objects.play_button.y,900]}, false, 0.5,'easeInBack',false);
		anim2.add(objects.lb_button,{y:[objects.lb_button.y,900]}, false, 0.5,'easeInBack',false);
		anim2.add(objects.rules_button,{y:[objects.rules_button.y,900]}, false, 0.5,'easeInBack',false);
		
		some_process.main_menu=function(){};
	}
		
}

lb={

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],

	show: function() {

		//objects.desktop.visible=true;
		objects.bcg.texture=gres.lb_bcg.texture;

		anim2.add(objects.lb_1_cont,{x:[-150,objects.lb_1_cont.sx]},true,0.4,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150,objects.lb_2_cont.sx]},true,0.45,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150,objects.lb_3_cont.sx]},true,0.5,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450,0]},true,0.5,'easeOutCubic');
		
		

		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;

		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}


		this.update();

	},

	close: function() {


		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_button.visible=false;
		objects.bcg.texture=gres.bcg.texture;

	},

	back_button_down: function() {

		if (anim2.any_on()) {
			sound.play('locked');
			return
		};


		sound.play('click');
		this.close();
		main_menu.activate();

	},

	update: function () {

		firebase.database().ref("players").orderByChild('rating').limitToLast(25).once('value').then((snapshot) => {

			if (snapshot.val()===null) {
			  //console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {

				var players_array = [];
				snapshot.forEach(players_data=> {
					if (players_data.val().name!=="" && players_data.val().name!=='' && players_data.val().name!==undefined)
						players_array.push([players_data.val().name, players_data.val().rating, players_data.val().pic_url]);
				});


				players_array.sort(function(a, b) {	return b[1] - a[1];});

				//создаем загрузчик топа
				var loader = new PIXI.Loader();

				var len=Math.min(10,players_array.length);

				//загружаем тройку лучших
				for (let i=0;i<3;i++) {
					
					if (i >= len) break;		
					if (players_array[i][0] === undefined) break;	
					
					let fname = players_array[i][0];
					make_text(objects['lb_'+(i+1)+'_name'],fname,180);					
					objects['lb_'+(i+1)+'_rating'].text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 3000});
				};

				//загружаем остальных
				for (let i=3;i<10;i++) {
					
					if (i >= len) break;	
					if (players_array[i][0] === undefined) break;	
					
					let fname=players_array[i][0];

					make_text(objects.lb_cards[i-3].name,fname,180);

					objects.lb_cards[i-3].rating.text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
				};

				loader.load();

				//показываем аватар как только он загрузился
				loader.onProgress.add((loader, resource) => {
					let lb_num=Number(resource.name.slice(-1));
					if (lb_num<3)
						objects['lb_'+(lb_num+1)+'_avatar'].texture=resource.texture
					else
						objects.lb_cards[lb_num-3].avatar.texture=resource.texture;
				});

			}

		});

	}

}

auth2 = {
		
	load_script : function(src) {
	  return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.type = 'text/javascript'
		script.onload = resolve
		script.onerror = reject
		script.src = src
		document.head.appendChild(script)
	  })
	},
			
	get_random_char : function() {		
		
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		return chars[irnd(0,chars.length-1)];
		
	},
	
	get_random_uid_for_local : function(prefix) {
		
		let uid = prefix;
		for ( let c = 0 ; c < 12 ; c++ )
			uid += this.get_random_char();
		
		//сохраняем этот uid в локальном хранилище
		try {
			localStorage.setItem('poker_uid', uid);
		} catch (e) {alert(e)}
					
		return uid;
		
	},
	
	get_random_name : function(uid) {
		
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		const rnd_names = ['Gamma','Chime','Dron','Perl','Onyx','Asti','Wolf','Roll','Lime','Cosy','Hot','Kent','Pony','Baker','Super','ZigZag','Magik','Alpha','Beta','Foxy','Fazer','King','Kid','Rock'];
		
		if (uid !== undefined) {
			
			let e_num1 = chars.indexOf(uid[3]) + chars.indexOf(uid[4]) + chars.indexOf(uid[5]) + chars.indexOf(uid[6]);
			e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);				
			let name_postfix = chars.indexOf(uid[7]).toString() + chars.indexOf(uid[8]).toString() + chars.indexOf(uid[9]).toString() ;	
			return rnd_names[e_num1] + name_postfix.substring(0, 3);					
			
		} else {

			let rnd_num = irnd(0, rnd_names.length - 1);
			let rand_uid = irnd(0, 999999)+ 100;
			let name_postfix = rand_uid.toString().substring(0, 3);
			let name =	rnd_names[rnd_num] + name_postfix;				
			return name;
		}	
	},	
	
	get_country_code : async function() {
		
		let country_code = ''
		try {
			let resp1 = await fetch("https://ipinfo.io/json");
			let resp2 = await resp1.json();			
			country_code = resp2.country;			
		} catch(e){}

		return country_code;
		
	},
	
	search_in_local_storage : function() {
		
		//ищем в локальном хранилище
		let local_uid = null;
		
		try {
			local_uid = localStorage.getItem('poker_uid');
		} catch (e) {alert(e)}
				
		if (local_uid !== null) return local_uid;
		
		return undefined;	
		
	},
	
	init : async function() {	
				
		if (game_platform === 'YANDEX') {			
		
			try {await this.load_script('https://yandex.ru/games/sdk/v2')} catch (e) {alert(e)};										
					
			let _player;
			
			try {
				window.ysdk = await YaGames.init({});			
				_player = await window.ysdk.getPlayer();
			} catch (e) { alert(e)};
			
			my_data.uid = _player.getUniqueID().replace(/[\/+=]/g, '');
			my_data.name = _player.getName();
			my_data.pic_url = _player.getPhoto('medium');
			
			if (my_data.pic_url === 'https://games-sdk.yandex.ru/games/api/sdk/v1/player/avatar/0/islands-retina-medium')
				my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';
			
			if (my_data.name === '')
				my_data.name = this.get_random_name(my_data.uid);
			
			//если английский яндекс до добавляем к имени страну
			let country_code = await this.get_country_code();
			my_data.name = my_data.name + ' (' + country_code + ')';			


			
			return;
		}
		
		if (game_platform === 'VK') {
			
			try {await this.load_script('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')} catch (e) {alert(e)};
			
			let _player;
			
			try {
				await vkBridge.send('VKWebAppInit');
				_player = await vkBridge.send('VKWebAppGetUserInfo');				
			} catch (e) {alert(e)};

			
			my_data.name 	= _player.first_name + ' ' + _player.last_name;
			my_data.uid 	= "vk"+_player.id;
			my_data.pic_url = _player.photo_100;
			
			return;
			
		}
		
		if (game_platform === 'GOOGLE_PLAY') {	

			let country_code = await this.get_country_code();
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('GP_');
			my_data.name = this.get_random_name(my_data.uid) + ' (' + country_code + ')';
			my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';	
			return;
		}
		
		if (game_platform === 'DEBUG') {		

			my_data.name = my_data.uid = 'debug' + prompt('Отладка. Введите ID', 100);
			my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';		
			return;
		}
		
		if (game_platform === 'CRAZYGAMES') {
			
			let country_code = await this.get_country_code();
			try {await this.load_script('https://sdk.crazygames.com/crazygames-sdk-v1.js')} catch (e) {alert(e)};			
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('CG_');
			my_data.name = this.get_random_name(my_data.uid) + ' (' + country_code + ')';
			my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';	
			let crazysdk = window.CrazyGames.CrazySDK.getInstance();
			crazysdk.init();			
			return;
		}
		
		if (game_platform === 'UNKNOWN') {
			
			//если не нашли платформу
			alert('Неизвестная платформа. Кто Вы?')
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('LS_');
			my_data.name = this.get_random_name(my_data.uid);
			my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';	
		}
	}
	
}

resize=function() {
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

set_state=function(params) {


}

vis_change=function() {

	if (document.hidden === true) {
		hidden_state_start = Date.now();	
		sound.on=0;
		sound.stop_all();
		
	}

	if (document.hidden === false) {
		sound.on=1;
		hidden_state_start = Date.now();	
		if (music.isPlaying===false&&music.on) music.play();
		
	}
	
		
}

async function load_resources() {
	
	document.getElementById("m_progress").style.display = 'flex';

	git_src="https://akukamil.github.io/diff/"
	//git_src=""

	//подпапка с ресурсами
	let lang_pack = ['RUS','ENG'][LANG];
	
	game_res=new PIXI.Loader();
	game_res.add("m2_font", git_src+"fonts/GOGONO/m_font.fnt");
	game_res.add("search_video", git_src+`search_video${irnd(1,5)}.mp4`);
	game_res.add('click',git_src+'sounds/click.mp3');
	game_res.add('my_diff_found',git_src+'sounds/my_diff_found.mp3');
	game_res.add('whoosh',git_src+'sounds/whoosh.mp3');
	game_res.add('locked',git_src+'sounds/locked.mp3');
	game_res.add('locked2',git_src+'sounds/locked2.mp3');
	game_res.add('opp_diff_found',git_src+'sounds/opp_diff_found.mp3');
	game_res.add('player_found',git_src+'sounds/new_found4.mp3');
	game_res.add('hint',git_src+'sounds/hint.mp3');
	game_res.add('whoosh2',git_src+'sounds/whoosh2.mp3');
	game_res.add('good_bonus',git_src+'sounds/good_bonus.mp3');
	game_res.add('bad_bonus',git_src+'sounds/bad_bonus.mp3');
	game_res.add('note5',git_src+'sounds/note5.mp3');
	game_res.add('win_round',git_src+'sounds/win_round.mp3');
	game_res.add('applause',git_src+'sounds/applause.mp3');
	game_res.add('lose',git_src+'sounds/lose.mp3');
	game_res.add('round_start',git_src+'sounds/note4.mp3');
	game_res.add('slide',git_src+'sounds/slide.mp3');
	game_res.add('music',git_src+'music/music.mp3');
	game_res.add('note6',git_src+'sounds/note6.mp3');
	
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            game_res.add(load_list[i].name, git_src+'res/'+lang_pack+'/'+load_list[i].name+"."+load_list[i].image_format);	


	game_res.onProgress.add(progress);
	function progress(loader, resource) {
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	

	
	await new Promise((resolve, reject)=> game_res.load(resolve))
	
	//короткое обращение к ресурсам
	gres=game_res.resources;
	music=gres.music.sound;	
	music.on=true;
	
	//убираем элементы загрузки
	document.getElementById("m_progress").outerHTML = "";	
}

language_dialog = {
	
	p_resolve : {},
	
	show : function() {
				
		return new Promise(function(resolve, reject){


			document.body.innerHTML='<style>		html,		body {		margin: 0;		padding: 0;		height: 100%;	}		body {		display: flex;		align-items: center;		justify-content: center;		background-color: rgba(24,24,64,1);		flex-direction: column	}		.two_buttons_area {	  width: 70%;	  height: 50%;	  margin: 20px 20px 0px 20px;	  display: flex;	  flex-direction: row;	}		.button {		margin: 5px 5px 5px 5px;		width: 50%;		height: 100%;		color:white;		display: block;		background-color: rgba(44,55,100,1);		font-size: 10vw;		padding: 0px;	}  	#m_progress {	  background: rgba(11,255,255,0.1);	  justify-content: flex-start;	  border-radius: 100px;	  align-items: center;	  position: relative;	  padding: 0 5px;	  display: none;	  height: 50px;	  width: 70%;	}	#m_bar {	  box-shadow: 0 10px 40px -10px #fff;	  border-radius: 100px;	  background: #fff;	  height: 70%;	  width: 0%;	}	</style><div id ="two_buttons" class="two_buttons_area">	<button class="button" id ="but_ref1" onclick="language_dialog.p_resolve(0)">RUS</button>	<button class="button" id ="but_ref2"  onclick="language_dialog.p_resolve(1)">ENG</button></div><div id="m_progress">  <div id="m_bar"></div></div>';
			
			language_dialog.p_resolve = resolve;	
						
		})
		
	}
	
}

async function define_platform_and_language() {
	
	let s = window.location.href;
	
	if (s.includes('yandex')) {
		
		game_platform = 'YANDEX';
		
		if (s.match(/yandex\.ru|yandex\.by|yandex\.kg|yandex\.kz|yandex\.tj|yandex\.ua|yandex\.uz/))
			LANG = 0;
		else 
			LANG = 1;		
		return;
	}
	
	if (s.includes('vk.com')) {
		game_platform = 'VK';	
		LANG = 0;	
		return;
	}
	
	if (s.includes('google_play')) {
			
		game_platform = 'GOOGLE_PLAY';	
		LANG = await language_dialog.show();
		return;
	}	

	
	if (s.includes('192.168')) {
			
		game_platform = 'DEBUG';	
		LANG = await language_dialog.show();
		return;	
	}	
	
	game_platform = 'UNKNOWN';	
	LANG = await language_dialog.show();
	
	

}

fake_players={
	
	users:{},
	resolver:0,
	
	start(){
		
		let script = document.createElement('script');
		let token='vk1.a.VMoIh7X59J7XQZuBlnzOCQrGqdlpzSHtjyJqrxG_2SJ-Bz0qXSf3hCeEMrEcqnzM6mF0Q5NAyQR5UJvg29obuQvK_OS8iqbl-EZ8OS84pQ4YPvQNY8rYBYavWSfdik5Y_opDnX3MkUCPkXgFjrlWFDXwNTh5OrKqYE1sJJY6l7SnBveVG9gIeP89O35vWHVR';
		let city_id=irnd(0,100);
		let q='';
		let hhh='https://api.vk.com/method/users.search?q=';
		hhh+=q;
		hhh+='&count=1000&fields=photo_100,last_seen&city_id=';
		hhh+=city_id;
		hhh+='&birth_day=';
		hhh+=irnd(0,25);
		hhh+='&birth_month=';
		hhh+=irnd(0,11);	
		hhh+='&status=';
		hhh+=irnd(0,8);	
		hhh+='&has_photo=1&access_token=';
		hhh+=token;
		hhh+='&v=5.131';
		hhh+='&callback=fake_players.response';
			
		script.src = hhh;	
		document.head.appendChild(script);
		
	},
	
	async run(){
		
		
		let players_cnt=0;
		
		for(let i=0;i<100000;i++){
			
			let data=await new Promise((res,rej)=>{
				fake_players.resolver=res;				
				fake_players.start();				
			})			
			
			data.forEach(p=>{
				
				if(p.last_seen) {
					
					const name=p.first_name+' '+p.last_name;
					const uid=p.id+p.first_name+p.last_name;	
					const pic_url=p.photo_100;
					
					if(/^[a-zA-Zа-яА-Я]+$/.test(p.first_name+p.last_name)===true && p.last_seen.time<1623101792 && this.users[uid]===undefined){
	
						this.users[uid]={};
						this.users[uid].uid=uid;
		
						firebase.database().ref("fp/"+players_cnt).set({uid,name,pic_url});
						players_cnt++;
					}					
				}
				
			})
			
			
			console.log('Уже набрано: '+Object.keys(this.users).length);
			//console.log("Ждем 3 сек...")
			await new Promise((resolve, reject) => setTimeout(resolve, 3000));
		}
		
		
		
	},
	
	response(data){		

		fake_players.resolver(data.response.items);

	}
	
}

async function init_game_env(lang) {
		
		
	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({
			apiKey: "AIzaSyBg80FwV8M25ftxUnijuIyAJjBJs4LMjtU",
			authDomain: "diff-e0107.firebaseapp.com",
			databaseURL: "https://diff-e0107-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "diff-e0107",
			storageBucket: "diff-e0107.appspot.com",
			messagingSenderId: "791357475056",
			appId: "1:791357475056:web:86590725dcb19e44291a35"
		});
	}

	//fake_players.run();return;	

		
	await define_platform_and_language();
	console.log(game_platform, LANG);
						
	//отображаем шкалу загрузки
	document.body.innerHTML='<style>html,body {margin: 0;padding: 0;height: 100%;	}body {display: flex;align-items: center;justify-content: center;background-color: rgba(41,41,41,1);flex-direction: column	}#m_progress {	  background: #1a1a1a;	  justify-content: flex-start;	  border-radius: 5px;	  align-items: center;	  position: relative;	  padding: 0 5px;	  display: none;	  height: 50px;	  width: 70%;	}	#m_bar {	  box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;	  border-radius: 5px;	  background: rgb(119, 119, 119);	  height: 70%;	  width: 0%;	}	</style></div><div id="m_progress">  <div id="m_bar"></div></div>';
			
	await load_resources();
	await auth2.init();


	
	app.stage = new PIXI.Container();
	app.renderer = new PIXI.Renderer({width:M_WIDTH, height:M_HEIGHT,antialias:true});
	document.body.appendChild(app.renderer.view).style["boxShadow"] = "0 0 15px #000000";
	document.body.style.backgroundColor = 'rgb(141,211,200)';

	resize();
	window.addEventListener("resize", resize);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(game_res.resources[obj_name].texture);
            eval(load_list[i].code0);
            break;

        case "block":
            eval(load_list[i].code0);
            break;

        case "cont":
            eval(load_list[i].code0);
            break;

        case "array":
			var a_size=load_list[i].size;
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i].code0);
            break;
        }
    }

    //обрабатываем вторую часть кода в объектах
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)
		
		
        switch (obj_class) {
        case "sprite":
            eval(load_list[i].code1);
            break;

        case "block":
            eval(load_list[i].code1);
            break;

        case "cont":	
			eval(load_list[i].code1);
            break;

        case "array":
			var a_size=load_list[i].size;
				for (var n=0;n<a_size;n++)
					eval(load_list[i].code1);	;
            break;
        }
    }
	
	//запускаем главный цикл
	main_loop();	
	
	//анимация лупы
	some_process.loup_anim=function() {
		objects.id_loup.x=20*Math.sin(game_tick*8)+90;
		objects.id_loup.y=20*Math.cos(game_tick*8)+150;
	}
	
	//ждем пока загрузится аватар
	let loader=new PIXI.Loader();
	loader.add("my_avatar", my_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});			
	await new Promise((resolve, reject)=> loader.load(resolve))	
	
	//устанавливаем фотки в попап и другие карточки
	objects.id_avatar.texture=loader.resources.my_avatar.texture;	
	
	//устанавлием имя на карточки
	make_text(objects.id_name,my_data.name,150);

		

	//получаем остальные данные об игроке
	const _other_data = await firebase.database().ref("players/"+my_data.uid).once('value');
	const other_data = _other_data.val();
	
	//делаем защиту от неопределенности
	my_data.rating = (other_data && other_data.rating) || 0;	
	my_data.games = (other_data && other_data.games) || 0;

	//рейтинг в мою карточку
	objects.id_rating.text=+my_data.rating;

	//убираем лупу
	objects.id_loup.visible=false;

	//обновляем данные в файербейс так как могли поменяться имя или фото
	firebase.database().ref("players/"+my_data.uid).set({name:my_data.name, pic_url: my_data.pic_url, rating : my_data.rating, games : my_data.games, games : my_data.games, tm:firebase.database.ServerValue.TIMESTAMP});


	//это событие когда меняется видимость приложения
	document.addEventListener("visibilitychange", vis_change);

	//keep-alive сервис
	setInterval(function()	{keep_alive()}, 40000);

	//убираем лупу
	some_process.loup_anim = function(){};
	objects.id_loup.visible=false;
		
	//ждем и убираем попап
	await new Promise((resolve, reject) => setTimeout(resolve, 1000));
	anim2.add(objects.id_cont,{y:[objects.id_cont.y,-180]}, false, 0.6,'easeInBack');	
	
	
	//показыаем основное меню
	main_menu.activate();
	
	console.clear()

}

var now, then=Date.now(), elapsed;
function main_loop() {

	now = Date.now();
	elapsed = now-then;

	if (elapsed > 10) {
		
		game_tick+=0.016666666;
		
		//обрабатываем минипроцессы
		for (let key in some_process)
			some_process[key]();	
		
		anim2.process();		
	}

	app.renderer.render(app.stage);		
	requestAnimationFrame(main_loop);	
}

