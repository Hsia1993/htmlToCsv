(function () {
  // Helper function to convert table to CSV
  function tableToCSV(table) {
    let csv = [];
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      let cols = row.querySelectorAll("td, th");
      let data = Array.from(cols).map(
        (col) => `"${col.innerText.replace(/"/g, '""')}"`
      );
      csv.push(data.join(","));
    });
    return csv.join("\n");
  }

  // Helper function to download CSV
  function downloadCSV(csvContent, filename = "table.csv") {
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Add export button to each table
  const tables = document.querySelectorAll("table");
  tables.forEach((table, index) => {
    const directThead = table.querySelectorAll(":scope > thead").length;
    const directTbody = table.querySelectorAll(":scope > tbody").length;
    let isValidTable = false;

    if (directThead && directTbody) {
      // Condition 1: Table has direct thead and tbody, each with at least one direct tr
      const theadDirectRows = table
        .querySelector(":scope > thead")
        .querySelectorAll(":scope > tr");
      const tbodyDirectRows = table
        .querySelector(":scope > tbody")
        .querySelectorAll(":scope > tr");
      isValidTable = theadDirectRows.length >= 1 && tbodyDirectRows.length >= 1;
    } else if (directTbody) {
      // Condition 2: Table has direct tbody with at least two direct tr
      const tbodyDirectRows = table
        .querySelector(":scope > tbody")
        .querySelectorAll(":scope > tr");
      isValidTable = tbodyDirectRows.length >= 2;
    } else {
      // Condition 3: Table has at least two direct tr
      const directRows = table.querySelectorAll(":scope > tr");
      isValidTable = directRows.length >= 2;
    }

    if (!isValidTable) return;

    const wrapper = document.createElement("div");
    wrapper.className = "export-wrapper";
    const exportBtn = document.createElement("button");
    exportBtn.innerText = "Export CSV";
    exportBtn.className = "export-csv-btn";
    exportBtn.addEventListener("click", () => {
      const csv = tableToCSV(table);
      downloadCSV(csv, `table-${index + 1}.csv`);
    });

    wrapper.appendChild(exportBtn);

    const computedStyle = window.getComputedStyle(table);
    if (computedStyle.position === "static") {
      table.style.position = "relative";
    }
    table.appendChild(wrapper);

    // Add hover listeners
    table.addEventListener("mouseenter", () => {
      wrapper.style.display = "block";
    });

    table.addEventListener("mouseleave", () => {
      wrapper.style.display = "none";
    });
  });
})();
