#include <iostream>
#include <cmath>

using namespace std;

int main() {
    double x, sum = 1, term = 1, precision = 1e-6;
    int factorial = 1;
    
    cout << "Enter the value of x: ";
    cin >> x;
    
    for (int i = 1; term >= precision; i++) {
        factorial *= i;
        term = pow(x, i) / factorial;
        sum += term;
    }
    
    cout << "Approximate value of e^" << x << " is: " << sum << endl;
    
    return 0;
}