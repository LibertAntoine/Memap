# :brain: Memap

<p align="center">
<img src="doc/readme-img//Memap.png?raw=true" width="45%" alt="Memap">
</p>

## Table of Contents

- [**Building configuration**](#Building-configuration)
  * [**Clone repository**](#clone-repository)
    - [**Clone frontend**](#clone-frontend)
    - [**Clone backend**](#clone-backend)    
  * [**Frontend**](#frontend)
    - [**Launch local frontend**](#launch-local-frontend)
    - [**Build frontend**](#build-frontend)
  * [**Backend**](#backend)
    - [**Complete env**](#complete-env)
    - [**Launch backend**](#launch-backend)

- [**Presentation**](#presentation)

- [**Main Features**](#main-features)
- [**Contributors**](#contributors)

- [**Dependencies**](#dependencies)
  * [**Frontend Dependencies**](#frontend-dependencies)
  * [**Backend Dependencies**](#backend-dependencies)


## Building configuration 
You need [Node.js](https://nodejs.org) to launch this project.
You also need to create a [Neo4j database](https://neo4j.com/) (version 3.5). After clone the backend, follow the instruction in doc folder to configure a local database.

### Clone repository 
In the local folder for the project
#### Clone frontend
```bash
git clone https://github.com/LibertAntoine/Memap.git
```
#### Clone backend
```bash
git clone https://github.com/nicolnt/memap-server.git
```

### Frontend
#### Launch local frontend
In the Node Command Prompt, in the frontend folder
```bash
npm install
npm run serve
```

#### Build frontend
In the Node Command Prompt, in the frontend folder
```bash
npm install
npm run build
```
The build forder is dist.

### Backend
#### Complete env
This project need env variable. You can use and rename .env.sample file to .env et complete it, with this default values for instance : 
* NEO4J_PROTOCOL=neo4j
* NEO4J_HOST=localhost
* NEO4J_USERNAME=neo4j
* NEO4J_PASSWORD=admin
* NEO4J_PORT=7687
* NEO4J_DATABASE=neo4j
* NEO4J_ENCRYPTION=ENCRYPTION_OFF

#### Launch backend
In the Node Command Prompt, in the backend folder
```bash
npm install
node app
```

## Presentation
<p>
The Memap application is a concept of a knowledge base manager inspired by human thought aimed at offering a storage tool for our knowledge that is more intuitive and more in line with our way of thinking. It offers a set of services allowing the cloud storage of various documents, the drafting of new documents, and navigation among these documents allowing them to be linked to each other, in a nodal spirit. The site also offers the possibility of splitting the display into several parts in order to view several documents or node networks at the same time.
</p>
<p>
This project is an initiative of Nicolas Liénart and Antoine Libert, included as a tutored project within the IMAC engineering school. 
</p>

Realized between September 2019 and today.


[**More details... (FR)**](doc/rapport_MEMAP.pdf)

<p align="center">
<img src="doc/readme-img//Memap2.png?raw=true" width="45%" alt="Screenshot">
<img src="doc/readme-img//Memap3.png?raw=true" width="45%" alt="Screenshot">
</p>


## Main Features

* Creation of an editor with TinyMCE library.
* Creation of a document browser in front with a nodal form.
* Neo4j database.
* Web scraping system for retrieving extracts from other websites.

## Contributors
* Antoine Libert – Editeur, Web Scraping.
* Nicolas Liénart – Nodal Viewer.

## Dependencies
### Frontend Dependencies
- [Axios](https://www.npmjs.com/package/axios) - For API requests.
- [Semantic-ui](https://www.npmjs.com/package/semantic-ui-vue) - For styles.
- [vue-tinymce-editor](https://www.npmjs.com/package/vue-tinymce-editor) - For wysiwyg editor.
- [vue-uuid](https://www.npmjs.com/package/vue-uuid) - For universal id creation.

### Backend Dependencies
- [express](https://www.npmjs.com/package/vue-fullscreen) - For application architecture.
- [cheerio](https://www.npmjs.com/package/cheerio) - For web scrapping.
- [neo4j-driver](https://www.npmjs.com/package/neo4j-driver) - For database interactions.
- [uuid](https://www.npmjs.com/package/uuid) - For universal id creation.
