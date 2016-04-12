$('#repeat1').on('click', function bathyClick(e){
    Bathy.setOpacity(0);
    	  shadedPrint();
});
$('#repeat0').on('click', function bathyunClick(e) {
    Bathy.setOpacity(0.75);
    	  bathyPrint();
});

$('#repeat1_Shaded').on('click', function shadedreliefClick(e) {
    BathyShaded.setOpacity(0);
});

$('#repeat0_Shaded').on('click',function shadedreliefunClick(e) {
    BathyShaded.setOpacity(0.75);
});

var shadedPrint = function (){
	 $('#bathylegend').hide(); 
	 $('#shadedlegend').show();  
	 $('img').css('float','left');
}
var bathyPrint = function (){
	 $('#bathylegend').show(); 	
	 $('#shadedlegend').hide();  
	 $('img').css('float','left');
}
