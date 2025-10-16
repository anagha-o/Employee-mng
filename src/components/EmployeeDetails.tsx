import React, { useEffect, useState } from 'react';
import { employeeService, type Employee } from '@/services/employeeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Edit, ArrowLeft } from 'lucide-react';

interface EmployeeDetailsProps {
  employeeId: string;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employeeId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: 0,
    hireDate: '',
    address: '',
    dob: '',
    skill: '',
    nationality: ''
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'personal'>('general');
  const [editable, setEditable] = useState({
    name: false,
    email: false,
    position: false,
    department: false,
    salary: false,
    hireDate: false,
    address: false,
    dob: false,
    skill: false,
    nationality: false,
  });

  const enableField = (field: keyof typeof editable) => {
    setEditable(prev => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const emp = await employeeService.getEmployeeById(employeeId);
        if (!emp) {
          setError('Employee not found');
          return;
        }
        setEmployee(emp);
        setFormData({
          name: emp.name,
          email: emp.email,
          position: emp.position,
          department: emp.department,
          salary: emp.salary,
          hireDate: emp.hireDate,
          address: emp.address || '',
          dob: emp.dob || '',
          skill: emp.skill || '',
          nationality: emp.nationality || '',
        });
      } catch (e: any) {
        setError(e.message || 'Failed to load employee');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [employeeId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee?.id) return;
    try {
      setSaving(true);
      await employeeService.updateEmployee(employee.id, formData);
      toast({ title: 'Saved', description: 'Employee updated successfully' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-destructive">{error}</div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header card */}
      <div className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold">
            {(formData.name || '').split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase() || 'E'}
          </div>
          <div>
            <div className="text-xl font-semibold leading-tight">{formData.name || 'Employee'}</div>
            <div className="text-sm text-muted-foreground">{formData.email}</div>
          </div>
        </div>
        <Button variant="outline" onClick={() => { window.location.hash = '#/'; }} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          All Employees
        </Button>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar nav */}
          <aside className="col-span-12 md:col-span-3">
            <div className="rounded-xl border">
              <div className="p-2">
                <button
                  type="button"
                  className={
                    "w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors " +
                    (activeTab === 'general'
                      ? 'bg-foreground text-background'
                      : 'hover:bg-muted text-foreground')
                  }
                  onClick={() => setActiveTab('general')}
                >
                  General Information
                </button>
              </div>
              <div className="px-2 pb-2">
                <button
                  type="button"
                  className={
                    "w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors " +
                    (activeTab === 'personal'
                      ? 'bg-foreground text-background'
                      : 'hover:bg-muted text-foreground')
                  }
                  onClick={() => setActiveTab('personal')}
                >
                  Personal Record
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="col-span-12 md:col-span-9">
            <form onSubmit={handleSave} className="space-y-6">
          {activeTab === 'general' && (
          <div className="divide-y rounded-xl border">
            {/* General Information */}
            {/* Name */}
            <div className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground">Full Name</div>
              <div className="col-span-10 md:col-span-8">
                {editable.name ? (
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                ) : (
                  <div className="text-base">{formData.name || '-'}</div>
                )}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button type="button" onClick={() => enableField('name')} className="inline-flex h-8 w-8 items-center justify-center rounded border hover:bg-accent" aria-label="Edit name">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Email */}
            <div className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground">Email</div>
              <div className="col-span-10 md:col-span-8">
                {editable.email ? (
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                ) : (
                  <div className="text-base">{formData.email || '-'}</div>
                )}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button type="button" onClick={() => enableField('email')} className="inline-flex h-8 w-8 items-center justify-center rounded border hover:bg-accent" aria-label="Edit email">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Position */}
            <div className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground">Position</div>
              <div className="col-span-10 md:col-span-8">
                {editable.position ? (
                  <Input id="position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required />
                ) : (
                  <div className="text-base">{formData.position || '-'}</div>
                )}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button type="button" onClick={() => enableField('position')} className="inline-flex h-8 w-8 items-center justify-center rounded border hover:bg-accent" aria-label="Edit position">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Department */}
            <div className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground">Department</div>
              <div className="col-span-10 md:col-span-8">
                {editable.department ? (
                  <Input id="department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
                ) : (
                  <div className="text-base">{formData.department || '-'}</div>
                )}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button type="button" onClick={() => enableField('department')} className="inline-flex h-8 w-8 items-center justify-center rounded border hover:bg-accent" aria-label="Edit department">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Salary */}
            <div className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground">Salary</div>
              <div className="col-span-10 md:col-span-8">
                {editable.salary ? (
                  <Input id="salary" type="number" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })} required />
                ) : (
                  <div className="text-base">{formData.salary ? `$${formData.salary.toLocaleString()}` : '-'}</div>
                )}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button type="button" onClick={() => enableField('salary')} className="inline-flex h-8 w-8 items-center justify-center rounded border hover:bg-accent" aria-label="Edit salary">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Hire Date */}
            <div className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground">Hire Date</div>
              <div className="col-span-10 md:col-span-8">
                {editable.hireDate ? (
                  <Input id="hireDate" type="date" value={formData.hireDate} onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })} required />
                ) : (
                  <div className="text-base">{formData.hireDate ? new Date(formData.hireDate).toLocaleDateString() : '-'}</div>
                )}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button type="button" onClick={() => enableField('hireDate')} className="inline-flex h-8 w-8 items-center justify-center rounded border hover:bg-accent" aria-label="Edit hire date">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          )}

          {activeTab === 'personal' && (
          <div className="divide-y rounded-xl border">
            {/* Address */}
            <div className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground">Address</div>
              <div className="col-span-10 md:col-span-8">
                {editable.address ? (
                  <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                ) : (
                  <div className="text-base">{formData.address || '-'}</div>
                )}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button type="button" onClick={() => enableField('address')} className="inline-flex h-8 w-8 items-center justify-center rounded border hover:bg-accent" aria-label="Edit address">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Date of Birth */}
            <div className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground">Date of Birth</div>
              <div className="col-span-10 md:col-span-8">
                {editable.dob ? (
                  <Input id="dob" type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
                ) : (
                  <div className="text-base">{formData.dob ? new Date(formData.dob).toLocaleDateString() : '-'}</div>
                )}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button type="button" onClick={() => enableField('dob')} className="inline-flex h-8 w-8 items-center justify-center rounded border hover:bg-accent" aria-label="Edit date of birth">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Skill */}
            <div className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground">Skill</div>
              <div className="col-span-10 md:col-span-8">
                {editable.skill ? (
                  <Input id="skill" value={formData.skill} onChange={(e) => setFormData({ ...formData, skill: e.target.value })} />
                ) : (
                  <div className="text-base">{formData.skill || '-'}</div>
                )}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button type="button" onClick={() => enableField('skill')} className="inline-flex h-8 w-8 items-center justify-center rounded border hover:bg-accent" aria-label="Edit skill">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Nationality */}
            <div className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground">Nationality</div>
              <div className="col-span-10 md:col-span-8">
                {editable.nationality ? (
                  <Input id="nationality" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} />
                ) : (
                  <div className="text-base">{formData.nationality || '-'}</div>
                )}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button type="button" onClick={() => enableField('nationality')} className="inline-flex h-8 w-8 items-center justify-center rounded border hover:bg-accent" aria-label="Edit nationality">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => { window.location.hash = '#/'; }}>Cancel</Button>
            <Button type="submit" className='bg-gray-900 text-white hover:bg-gray-800' disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;


