import React, { useState, useEffect } from 'react';
import { employeeService, type Employee } from '../services/employeeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StepperProgress from '@/components/ui/stepper';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Users, Eye } from 'lucide-react';

const EmployeeManager: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  // details handled via routing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: 0,
    hireDate: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } catch (error: any) {
      setError('Failed to load employees: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Multi-step flow: advance from step 1 to 2; submit on step 2
    if (!editingEmployee && currentStep === 1) {
      if (!formData.name || !formData.email) {
        toast({ title: 'Missing info', description: 'Please enter first and last name and email', variant: 'destructive' });
        return;
      }
      setCurrentStep(2);
      return;
    }

    try {
      setError('');
      
      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee.id!, formData);
        toast({
          title: "Success",
          description: "Employee updated successfully!",
        });
      } else {
        await employeeService.createEmployee(formData);
        toast({
          title: "Success",
          description: "Employee added successfully!",
        });
      }
      
      setShowForm(false);
      setEditingEmployee(null);
      setFormData({
        name: '',
        email: '',
        position: '',
        department: '',
        salary: 0,
        hireDate: ''
      });
      setCurrentStep(1);
      loadEmployees();
    } catch (error: any) {
      if (error.message.includes('email already exists')) {
        toast({
          title: "Error",
          description: "An employee with this email already exists!",
          variant: "destructive",
        });
      } else {
        setError('Failed to save employee: ' + error.message);
        toast({
          title: "Error",
          description: "Failed to save employee: " + error.message,
          variant: "destructive",
        });
      }
    }
  };

  // edit from list no longer used; editing from details page

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (employeeToDelete) {
      try {
        await employeeService.deleteEmployee(employeeToDelete);
        toast({
          title: "Success",
          description: "Employee deleted successfully!",
        });
        loadEmployees();
      } catch (error: any) {
        setError('Failed to delete employee: ' + error.message);
        toast({
          title: "Error",
          description: "Failed to delete employee: " + error.message,
          variant: "destructive",
        });
      }
    }
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      position: '',
      department: '',
      salary: 0,
      hireDate: ''
    });
    setCurrentStep(1);
  };

  const handleView = (employee: Employee) => {
    window.location.hash = `#/employees/${encodeURIComponent(employee.id || '')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => setShowForm(true)} className="gap-2 bg-gray-900 text-white hover:bg-gray-800">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) handleCancel(); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'Update Employee' : 'Add Employee'}</DialogTitle>
            <DialogDescription>
              {editingEmployee ? 'Update employee information' : 'Follow the steps to add a new employee'}
            </DialogDescription>
          </DialogHeader>
          {!editingEmployee && (
            <div className="mb-4">
              <StepperProgress steps={["Basic Info", "Job Details"]} currentStep={currentStep} />
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {editingEmployee || currentStep === 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Position
                  </label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Enter job position"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Department
                  </label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Enter department"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="salary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Salary
                  </label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    placeholder="Enter salary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="hireDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Hire Date
                  </label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-1 col-span-1">
                  <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter first and last name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              {!editingEmployee && currentStep === 2 && (
                <Button type="button" variant="secondary" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
              )}
              <Button type="submit" className='bg-gray-900 text-white hover:bg-gray-800'>
                {editingEmployee ? 'Update Employee' : currentStep === 1 ? 'Continue' : 'Create Employee'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>
            {employees.length === 0 
              ? "No employees found. Add your first employee!" 
              : `Manage your ${employees.length} employee${employees.length === 1 ? '' : 's'}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No employees yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first employee.</p>
              <Button onClick={() => setShowForm(true)} className="gap-2 bg-gray-900 text-white hover:bg-gray-800">
                <Plus className="h-4 w-4" />
                Add Employee
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>${employee.salary.toLocaleString()}</TableCell>
                    <TableCell>{new Date(employee.hireDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(employee)}
                          className="gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(employee.id!)}
                          className="gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details modal removed; use dedicated page via hash routing */}

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManager;
