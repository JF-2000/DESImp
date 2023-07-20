function filtrartabla(dbfilter, dbtable) {
    // console.log(dbfilter.value)
    var filter, table, tr, td, i, txtValue, res;
    filter = dbfilter.value.toUpperCase();
    table = dbtable;
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        res = 0;
        for (j = 0; j <= 3; j++) {
            td = tr[i].getElementsByTagName("td")[j];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    res = res + 1
                };
            }
        }
        if (res > 0) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
  }