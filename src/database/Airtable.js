import Airtable from 'airtable';

class AirtableConnection {

//Token api Airtable
base() {
   return new Airtable({apiKey: 'keyPY6L84ZOqihHyu'}).base('appSK9OCaWuHpaV42');
}

// Get info from the table
async getBeaches(base){

    try {
    const querySnapshot = await base('abBeachesControl').select({ maxRecords: 300, view: 'Grid view' }).all();
    const data = [];
    querySnapshot.forEach((record) => {
        const beach = {
            name: record.get('Name_Beach'),
            city: record.get('City_Beach')[0],
            flag: record.get('Flag_Beach')
        };
        data.push(beach);
    });
    return data;
    } catch (e){
        console.error('Error form get info from Airtable');
    }

}    
}


export default AirtableConnection;
