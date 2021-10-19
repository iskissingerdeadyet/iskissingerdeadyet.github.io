//File name: checkwiki.js
//Purpose: Check Wikidata to determine whether Henry Kissinger's Wikipedia page includes a date of death. The code can be adapted to query any person with a Wikipedia page.
//Date: October 2021
//Author: A comrade
//Permissions: A link to iskissingerdeadyet.com is appreciated but not required.

//The starting point for this code can be found at: https://query.wikidata.org
//(run the query by pressing the Play [triangle] button and then click "Code,"
//then "JavaScript (modern)")
//Full URL: https://query.wikidata.org/sparql?query=SELECT%20(COUNT(%3Fdied)%20as%20%3FisDead)%20WHERE%0A%7B%0A%20%20%3Fperson%20wdt%3AP734%20wd%3AQ37445250%3B%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP735%20wd%3AQ1158477%3B%0A%09%09%20%20wdt%3AP39%20wd%3AQ14213%3B%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP570%20%3Fdied.%0A%7D

//I added the async/await bits so that the webpage checks Wikipedia when it loads.
//(There may be other solutions for this.)
//If you're okay with triggering the script through user action, like pressing a button,
//async/await is not needed.

class SPARQLQueryDispatcher {
//query a SPARQL database (such as Wikidata) and return data in JSON format

	constructor( endpoint ) {
		this.endpoint = endpoint;
	}

	query( sparqlQuery ) {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
		const headers = { 'Accept': 'application/sparql-results+json' };
		
		return fetch( fullUrl, { headers } ).then( body => body.json() );
	}
}

async function getWikidata() {
//query Wikidata to find out whether Henry Kissinger's Wikipedia entry has a date of death attached

	const endpointUrl = 'https://query.wikidata.org/sparql';
	const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );

	const sparqlQuery = `SELECT (COUNT(?died) as ?isDead) WHERE
	{
	  ?person wdt:P734 wd:Q37445250; 
			  wdt:P735 wd:Q1158477;
			  wdt:P39 wd:Q14213;
			  wdt:P570 ?died.
	}`;
	//count the number of people (?person) on Wikipedia where:
	//P734 (family name) = Q37445250 (Kissinger)
	//P735 (given name) = Q1158477 (Henry)
	//P39 (occupation) = Q14213 (US Secretary of State)
	//P570 (date of death) is listed in the entry 
	//The output will be 1 if a date of death is listed, 0 otherwise.
	
	//To use this code for a different person, search for that person on Wikidata:
	//https://www.wikidata.org/wiki/Wikidata:Main_Page
	//Then replace the strings starting with Q with the corresponding strings for
	//the person of interest.
	//If there is more than one person with the same given name, family name, and
	//occupation, add more criteria (the strings starting with P).

	try {
		return resultObj = await queryDispatcher.query( sparqlQuery );
		}
		catch(error) {
			console.log(error);
		}

}


async function renderWikidata() {
//pull the desired value from Wikidata output and convert it into text for the website

	let resultData = await getWikidata();
	var resultValue = resultData["results"]["bindings"][0]["isDead"]["value"];
	//I used the console log to work out the structure of the JSON object.
	//Yes, I tried downloading the results as a JSON file directly from Wikidata.
	//No, that didn't work.
	
	var resultString = '';
	var tenseString = '';
	var checkedString = 'We just checked Wikipedia.'
	
	if (resultValue == 0) {
		//0 = still alive
		resultString += 'Henry Kissinger is not yet dead, unlike the 150,000 Cambodian civilians who were killed on his orders.';
		tenseString += 'is a human being. We do not wish for his death. We\'re just wondering why it hasn\'t happened yet.';
	} else if (resultValue == 1) {
		//1 = dead
		resultString += 'Henry Kissinger is dead.';
		tenseString += 'was a human being. We did not wish for his death. We were just wondering why it hadn\'t happened yet.';
	} else {
		//I genuinely have no idea
		resultString += 'An unexpected result came back.';
		tenseString += 'is a human being. We do not wish for his death. We\'re just wondering why it hasn\'t happened yet.';
	}

	document.getElementById('justchecked').innerHTML = checkedString;
	document.getElementById('wikidata').innerHTML = resultString;
	document.getElementById('changeTense').innerHTML = tenseString;

};