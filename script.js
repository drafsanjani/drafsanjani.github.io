/** From: https://stackoverflow.com/questions/59218548/what-is-the-best-way-to-convert-from-csv-to-json-when-commas-and-quotations-may/59219146#59219146
 * Takes a raw CSV string and converts it to a JavaScript object.
 * @param {string} string The raw CSV string.
 * @param {string[]} headers An optional array of headers to use. If none are
 * given, they are pulled from the file.
 * @param {string} quoteChar A character to use as the encapsulating character.
 * @param {string} delimiter A character to use between columns.
 * @returns {object[]} An array of JavaScript objects containing headers as keys
 * and row entries as values.
 */
const csvToJson = (string, headers, quoteChar = '"', delimiter = ",") => {
  const regex = new RegExp(
    `\\s*(${quoteChar})?(.*?)\\1\\s*(?:${delimiter}|$)`,
    "gs"
  );
  const match = (string) =>
    [...string.matchAll(regex)]
      .map((match) => match[2])
      .filter((_, i, a) => i < a.length - 1); // cut off blank match at end

  const lines = string.split("\n");
  const heads = headers || match(lines.splice(0, 1)[0]);
  return lines.map((line) =>
    match(line).reduce(
      (acc, cur, i) => ({
        ...acc,
        [heads[i] || `extra_${i}`]: cur.length > 0 ? Number(cur) || cur : null
      }),
      {}
    )
  );
};
const ID = "13fiUy_1cAZAAZBA37Tpxe2wG75Ep4JdCtUTXfnH9itY";
const csvURL =
  "https://docs.google.com/spreadsheets/d/" +
  ID +
  "/export?format=csv&gid=898476419";

Quasar.lang.set(Quasar.lang.ptBr);

new Vue({
  el: "#app",
  created() {
    this.loadData();
  },
  data() {
    return {
      res: [],
      columns: [
        {
          name: "Nome",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.Nome,
          sortable: true
        }
      ],
      filter: "",
      loading: false,
      pagination: {
        descending: false,
        rowsPerPage: 15
      }
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      fetch(csvURL).then((resp) => {
        resp.text().then((text) => {
          this.res = csvToJson(text);
          this.columns = Object.keys(this.data[0]).map((n) => ({
            name: n,
            label: n,
            field: n,
            align: "left",
            sortable: true
          }));
        });
      });
      this.loading = false;
    }
  },
  template: `<q-table 
       separator="cell" 
       dense="true" 
       v-if="res.length" 
       title="Alummi" 
       :data="res" 
       :columns="columns"
       :filter="filter"
       :pagination="pagination"
       :loading="loading"       
       :rows-per-page-options="[15]"
       table-header-class="text-weight-bolder bg-primary text-white" 
       flat>             
       <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
      </template>       
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="Nome" :props="props">          
             <a :href="props.row.Lattes">{{ props.row.Nome}}</a>
             </a>
          </q-td>
        </q-tr>
      </template>
    </q-table>`
});
