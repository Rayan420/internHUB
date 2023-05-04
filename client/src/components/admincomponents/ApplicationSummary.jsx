import { useState } from 'react';
import React from 'react';
import Pagination from '@mui/material/Pagination'

const ApplicationSummary = () => {
  return (
    <div className='admin-application-summary'>
        <h2 className='aaps-title'>Application Summary</h2>

        <table className='styled-table'>
        <thead>
        <tr>
            <th>Student ID</th>
            <th>Student</th>
            <th>Department</th>
            <th>Coordinator</th>
            <th>App. ID</th>
            <th>Approved/Rejected</th>

        </tr>
    </thead>
    <tbody>
        <tr>
            <td>6000</td>
            <td>dom</td>
            <td>software</td>
            <td>jane</td>
            <td>6000</td>
            <td className='approve-rejected'>approved</td>

        </tr>
        <tr>
            <td>6000</td>
            <td>dom</td>
            <td>software</td>
            <td>jane</td>
            <td>6000</td>
            <td>approved</td>

        </tr>
        <tr>
            <td>6000</td>
            <td>dom</td>
            <td>software</td>
            <td>jane</td>
            <td>6000</td>
            <td>approved</td>

        </tr>
        <tr>
            <td>6000</td>
            <td>dom</td>
            <td>software</td>
            <td>jane</td>
            <td>6000</td>
            <td>approved</td>

        </tr>
        <tr>
            <td>6000</td>
            <td>dom</td>
            <td>software</td>
            <td>jane</td>
            <td>6000</td>
            <td>approved</td>

        </tr>
        <tr>
            <td>6000</td>
            <td>dom</td>
            <td>software</td>
            <td>jane</td>
            <td>6000</td>
            <td>approved</td>

        </tr>
        <tr>
            <td>6000</td>
            <td>dom</td>
            <td>software</td>
            <td>jane</td>
            <td>6000</td>
            <td>approved</td>

        </tr>
        
    </tbody>
        </table>
        <Pagination count={10} variant="outlined" shape="rounded" />

    </div>
  );

};

export default ApplicationSummary;





