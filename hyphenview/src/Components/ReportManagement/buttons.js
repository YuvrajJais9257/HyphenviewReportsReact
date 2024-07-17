buttons: [
  {
    extend: "colvis",
    text: '<i class="fa fa-columns" aria-hidden="true"></i>',
    titleAttr: "Show / Hide Columns",
    className: "btn-icon",
  },
  {
    extend: "searchBuilder",
    text: '<i class="fa fa-filter" aria-hidden="true"></i>',
    titleAttr: "Filter",
    className: "btn-icon",
  },
  {
    text: '<i class="fa fa-sort" aria-hidden="true"></i>',
    action: function (e, dt, node, config) {
      var multiSortDialog = $("#multiSortDialog");
      if (multiSortDialog.length === 0) {
        multiSortDialog = $(
          '<div id="multiSortDialog" title="MultiSort"><div id="multiSortContainer"></div><button id="addConditionButton" type="button">Add condition</button></div>'
        ).appendTo("body");
      }
      multiSortDialog.dialog({
        width: 400,
        modal: true,
        buttons: {
          Apply: function () {
            var order = [];
            $("#multiSortContainer .sortCondition").each(function () {
              var column = $(this).find("select.column").val();
              var dir = $(this).find("select.direction").val();
              if (column && dir) {
                order.push([parseInt(column), dir]);
              }
            });
            dt.order(order).draw();
            $(this).dialog("close");
          },
          Cancel: function () {
            $(this).dialog("close");
          },
        },
      });

      var columns = dt.settings().init().columns;
      var container = $("#multiSortContainer");
      container.empty();

      var addCondition = function () {
        var condition = $('<div class="sortCondition"></div>');
        var columnSelect = $('<select class="column"></select>');
        columnSelect.append('<option value="">Select column</option>');
        dt.columns().every(function (index) {
          if (this.visible()) {
            columnSelect.append(
              '<option value="' +
                index +
                '">' +
                this.header().innerHTML +
                "</option>"
            );
          }
        });
        var directionSelect = $('<select class="direction"></select>');
        directionSelect.append('<option value="">Select direction</option>');
        directionSelect.append('<option value="asc">Ascending</option>');
        directionSelect.append('<option value="desc">Descending</option>');
        var removeButton = $('<button type="button">Remove</button>').click(
          function () {
            $(this).parent().remove();
          }
        );
        condition
          .append(columnSelect)
          .append(directionSelect)
          .append(removeButton);
        container.append(condition);
      };

      addCondition();
      $("#addConditionButton")
        .off("click")
        .on("click", function () {
          addCondition();
        });
    },
    titleAttr: "MultiSort",
    className: "btn-icon",
  },
  {
    extend: "collection",
    text: '<i class="fa fa-download" aria-hidden="true"></i>',
    titleAttr: "Download",
    className: "btn-icon",
    buttons: [
      {
        text: "Download Excel",
        action: function (e, dt, node, config) {
          var headers = [];
          var visibleColumnIndexes = [];
          var chunkSize = 1000; // Number of rows per chunk

          dt.columns().every(function (index) {
            if (this.visible()) {
              headers.push($(this.header()).text().trim());
              visibleColumnIndexes.push(index);
            }
          });

          var data = [];
          var rows = dt.rows({ search: "applied" }).data().toArray();
          var chunks = [];

          for (var i = 0; i < rows.length; i += chunkSize) {
            chunks.push(rows.slice(i, i + chunkSize));
          }

          function processChunk(chunkIndex) {
            if (chunkIndex >= chunks.length) {
              data.unshift(headers);

              var wb = XLSX.utils.book_new();
              var ws = XLSX.utils.aoa_to_sheet(data);
              XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

              var wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });

              function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i < s.length; i++) {
                  view[i] = s.charCodeAt(i) & 0xff;
                }
                return buf;
              }

              var blob = new Blob([s2ab(wbout)], {
                type: "application/octet-stream",
              });
              saveAs(blob, report_name + ".xlsx");
              return;
            }

            var chunk = chunks[chunkIndex];
            var chunkData = chunk.map(function (row) {
              var rowData = [];
              for (var i = 0; i < visibleColumnIndexes.length; i++) {
                rowData.push(row[visibleColumnIndexes[i]]);
              }
              return rowData;
            });

            data = data.concat(chunkData);

            setTimeout(function () {
              processChunk(chunkIndex + 1);
            }, 0);
          }

          processChunk(0);
        },
        titleAttr: "Download Excel",
        className: "btn-icon",
      },
      {
        text: "Download PDF",
        action: function (e, dt, node, config) {
          var visibleColumns = dt
            .columns()
            .indexes()
            .toArray()
            .filter(function (idx) {
              return dt.column(idx).visible();
            });

          var headers = [];
          dt.columns().every(function (index) {
            if (this.visible()) {
              headers.push($(this.header()).text().trim());
            }
          });

          var bodyData = [];
          var rows = dt.rows({ search: "applied" }).data().toArray();
          var chunkSize = 1000; // Number of rows per chunk
          var chunks = [];

          for (var i = 0; i < rows.length; i += chunkSize) {
            chunks.push(rows.slice(i, i + chunkSize));
          }

          function processChunk(chunkIndex) {
            if (chunkIndex >= chunks.length) {
              var docDefinition = {
                pageSize: "A0",
                pageOrientation: "landscape",
                content: [
                  {
                    table: {
                      headerRows: 1,
                      widths: visibleColumns.map(function () {
                        return "auto";
                      }),
                      body: [
                        headers.filter(function (_, idx) {
                          return visibleColumns.includes(idx);
                        }),
                      ].concat(bodyData),
                    },
                  },
                ],
              };

              pdfMake.createPdf(docDefinition).download(report_name + ".pdf");
              return;
            }

            var chunk = chunks[chunkIndex];
            var chunkData = chunk.map(function (row) {
              return visibleColumns.map(function (colIdx) {
                return row[colIdx];
              });
            });

            bodyData = bodyData.concat(chunkData);

            setTimeout(function () {
              processChunk(chunkIndex + 1);
            }, 0);
          }

          processChunk(0);
        },
        titleAttr: "Download PDF",
        className: "btn-icon",
      },
    ],
  },
];
