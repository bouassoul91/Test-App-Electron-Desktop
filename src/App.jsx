import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community"; // themeQuartz or themeAlpine, themeBalham

function Chip({ text }) {
  return <span className="chip">{text}</span>;
}

function ServicesCell({ value }) {
  const arr = Array.isArray(value) ? value : [];
  return (
    <div className="chipRow">
      {arr.map((s) => (
        <Chip key={s} text={s} />
      ))}
    </div>
  );
}

function NotifyButtonCell(props) {
  const { data } = props;
  const disabled = !!data?.notified;

  return (
    <button
      className="btn"
      disabled={disabled}
      onClick={async () => {
        await window.api.leads.notifySales(data.id);
        props.api.applyTransaction({ update: [{ ...data, notified: true }] });
      }}
    >
      {disabled ? "Notified" : "Notify Sales team"}
    </button>
  );
}

export default function App() {
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [quickFilter, setQuickFilter] = useState("");

  console.log("Test Console App");
  console.log("Test Console rowData");
  console.log(rowData);

  console.log("window.api =", window.api);

  useEffect(() => {
    (async () => {
      try {
        console.log("Calling API...");

        const leads = await window.api.leads.listLeads();

        console.log("Returned:");
        console.log(leads);

        setRowData(leads);

      } catch (err) {
        console.error("API Error:", err);
      }
    })();
  }, []);

  console.log("Test Console rowData");
  console.log(rowData);

  const selectionColumnDef = useMemo(
    () => ({
      headerName: "",
      width: 50,
      pinned: "left",
      sortable: false,
      resizable: false,
      suppressHeaderMenuButton: true,
    }),
    []
  );

  const colDefs = useMemo(
    () => [
      { headerName: "ID", field: "id", width: 130, pinned: "left" },
      { headerName: "Email", field: "email", flex: 1 },
      { headerName: "Company name", field: "company_name", flex: 1 },
      {
        headerName: "Notify sales team",
        field: "notified",
        width: 180,
        cellRenderer: NotifyButtonCell,
        sortable: false,
        filter: false,
      },
      {
        headerName: "Which services are you ...",
        field: "services",
        flex: 1,
        cellRenderer: ServicesCell,
        valueParser: (p) => {
          // allow editing as comma-separated text: "SEO, Press"
          if (Array.isArray(p.newValue)) return p.newValue;
          const s = String(p.newValue ?? "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
          return s;
        },
      },
      { headerName: "Phone number", field: "phone", width: 180 },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  async function onCellValueChanged(e) {
    const { id } = e.data;
    const patch = { [e.colDef.field]: e.data[e.colDef.field] };
    await window.api.leads.updateLead(id, patch);
  }

  async function addRow() {
    console.log("Create button clicked");
    if (!gridApi) {
      console.warn("Grid not ready yet");
      return;
    }

    const newLead = {
      email: "",
      company_name: "",
      phone: "",
      services: [],
      notified: false,
    };

    const res = await window.api.leads.createLead(newLead);
    const full = { id: res.id, ...newLead };

    gridApi.applyTransaction({ add: [full], addIndex: 0 });
  }

  async function deleteSelected() {
    if (!gridApi) return;
    const selected = gridApi.getSelectedRows();
    for (const r of selected) await window.api.leads.deleteLead(r.id);
    gridApi.applyTransaction({ remove: selected });
  }

  async function exportSelected() {
    if (!gridApi) return;

    const selected = gridApi.getSelectedRows();
    if (selected.length === 0) {
      window.alert("Select at least one row to export.");
      return;
    }

    const result = await window.api.export.toExcel(selected, "leads-export.xlsx");

    if (!result.canceled) {
      console.log("Exported to", result.filePath);
    }
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="title">Lead Capture: Leads</div>
        <div className="spacer" />
        <input
          className="search"
          placeholder="Search records"
          value={quickFilter}
          onChange={(e) => {
            const v = e.target.value;
            setQuickFilter(v);
            gridApi?.setGridOption("quickFilterText", v);
          }}
        />
        <button className="btnPrimary" onClick={addRow}>+ Create</button>
        <button className="btn" onClick={exportSelected}>Export selected</button>
        <button className="btnDanger" onClick={deleteSelected}>Delete</button>
      </header>

      <div className="gridWrap">
        <div className="ag-theme-alpine gridContainer">
          <AgGridReact
            theme={themeQuartz}
            onGridReady={(params) => setGridApi(params.api)}
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            selectionColumnDef={selectionColumnDef}
            rowSelection={{ mode: "multiRow", checkboxes: true, headerCheckbox: true }}
            animateRows
            getRowId={(p) => p.data.id}
            onCellValueChanged={onCellValueChanged}
          />
        </div>
      </div>
    </div>
  );
}